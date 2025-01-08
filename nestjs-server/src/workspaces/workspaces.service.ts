import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PrismaError } from 'src/utils/prisma-error';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { calculateSalesWithMonths, calculateWorkspaceSalesOverTime } from 'src/utils/sales-over-time';
import { calculateStudentsKpiWithMonths } from 'src/utils/students-over-time';
import slugify from 'slugify';

@Injectable()
export class WorkspacesService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getManagerWorkspaceKpis(subdomain: string, manager_id: string) {
        const workspace = await this.prisma.workspaces.findUnique({
            where: {
                subdomain
            },
            select: {
                workspace_id: true
            }
        })

        if (!workspace) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    message: "Workspace not found"
                },
                HttpStatus.NOT_FOUND
            );
        }
        // get sales kpis for this workspace
        const { total_sales, last_month_sales, current_month_sales } = await this.prisma.workspaces.findUnique({
            where: {
                subdomain,
                manager_id
            },
            select: {
                total_sales: true,
                last_month_sales: true,
                current_month_sales: true
            }
        })

        // get percentage difference between last month and current month
        let salesDiff = 0;
        if (current_month_sales && last_month_sales) {
            salesDiff = ((current_month_sales - last_month_sales) / last_month_sales) * 100;
        }

        /** get top popular courses **/
        const popularCourses = await this.prisma.courses.findMany({
            where: {
                workspace_id: workspace.workspace_id
            },
            orderBy: {
                number_of_students: 'desc'
            },
            select: {
                slug: true,
                course_name: true,
                number_of_students: true,
                overall_rating: true,
                promotional_image: true,
                deleted_at: true
            },
            take: 5
        })

        // get total learners kpi
        const total_learners = await this.prisma.students.findMany({
            where: {
                workspaces: {
                    some: {
                        workspace_id: workspace.workspace_id
                    }
                }
            },
            select: {
                email: true,
                workspaces: {
                    select: {
                        workspace_id: true,
                        added_at: true
                    }
                }
            }
        })

        // get learners added to workspace in 30 days
        const learnersAddedToWorkspace = total_learners.filter(learner => {
            // get only workspace that had workspace_id equals to workspace.workspace_id
            const current_workspace = learner.workspaces.find(el => el.workspace_id === workspace.workspace_id)
            const addedAt = new Date(current_workspace.added_at)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

            return addedAt > thirtyDaysAgo
        })

        // get sales kpi of the last 3 months using courses.students.added_at
        const coursesWithStudents = await this.prisma.courses.findMany({
            where: {
                workspace_id: workspace.workspace_id,
                students: {
                    isEmpty: false
                }
            },
            select : {
                slug: true,
                students: {
                    select: {
                        email: true,
                        added_at: true,
                        amount_paid: true
                    }
                }
            }
        })

        const {sales_over_time, months_by_sales} = calculateSalesWithMonths(coursesWithStudents, 12);

        // get number of students in workspace over time (last 3, 6, 12 months)
        const workspaceStudents = await this.prisma.students.findMany({
            where: {
                workspaces: {

                    some: {
                        workspace_id: {
                            equals: workspace.workspace_id
                        }
                    }
                }
            },
            select: {
                email: true,
                workspaces: {
                    select: {
                        workspace_id: true,
                        added_at: true
                    }
                }
            }
        })

        // return only students in current workspace with workspace_id === workspace.workspace_id
        const currentWorkspaceStudents = workspaceStudents.map(student => {
            const studentWorkspace = student.workspaces.find(ws => ws.workspace_id === workspace.workspace_id);
            if (studentWorkspace) {
              return {
                email: student.email,
                added_at: studentWorkspace.added_at
              };
            }
          }).filter(Boolean)

        const { students_over_time, months_by_students } = calculateStudentsKpiWithMonths(currentWorkspaceStudents, 12);
          
        return {
            status: HttpStatus.OK,
            data: {
                "sales_kpi": {
                    "total_sales": total_sales || 0,
                    "last_month_sales": last_month_sales || 0,
                    "current_month_sales": current_month_sales || 0,
                    "sales_diff": salesDiff.toFixed(2) || 0
                },
                "learners_kpi": {
                    "total_learners": total_learners.length,
                    "learners_diff": learnersAddedToWorkspace.length
                },
                "popular_courses": popularCourses.filter(course => course.deleted_at === null),
                "sales_over_time": {
                    "data": sales_over_time,
                    "months": months_by_sales
                },
                "students_over_time": {
                    "data": students_over_time,
                    "months": months_by_students
                }
            },
            message: 'KPIs returned successfully'
        }

    }

    async create_workspace(manager_id: string, workspace_data: CreateWorkspaceDto) {
        try {
            const subdomain = slugify(workspace_data.name, { lower: true, trim: true, replacement: "" })
            const workspace = await this.prisma.workspaces.create({
                data: {manager_id, subdomain, ...workspace_data}, select: {
                    workspace_id: true,
                    subdomain: true,
                    name: true,
                }
            })
    
            return {
                status: HttpStatus.CREATED,
                data: workspace,
                message: "Workspace created successfully"
            }
        } catch (error) {
            throw new HttpException("Something went wrong creating workspace", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update_workspace(workspace_id: string, workspace_data: UpdateWorkspaceDto) {
        try {
            return await this.prisma.workspaces.update({
                data: workspace_data,
                where: {
                    workspace_id,
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new NotFoundException(`Workspace with this ID : ${workspace_id} not found`);
            }
            throw error;
        }
    }

    async get_workspace_by_subdomain(subdomain: string) {
        try {
            const workspace = await this.prisma.workspaces.findUnique({
                where: {subdomain},
                select: {
                    workspace_id: true,
                    name: true,
                }
            });

            if (!workspace) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Workspace not found"
                }
            }

            return {
                status: HttpStatus.OK,
                data: workspace,
                message: "Workspace name fetched successfully"
            }
        } catch (error) {
            
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Something went wrong fetching workspace name"  
            }
        }
    }
}
