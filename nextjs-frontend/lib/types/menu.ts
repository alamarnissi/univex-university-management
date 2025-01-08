import React from "react";

export type Menu = {
  id: number;
  title: any;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};


type ChildDashboardMenuType = {
  name: string,
  layout: string,
  path: string,
  icon: React.ReactNode,
  hasRole: string[],
}

export type DashboardMenuType = {
  name: string,
  layout: string,
  path: string,
  icon: React.ReactNode,
  hasRole: string[],
  hasChild: boolean,
  children: ChildDashboardMenuType[] | []
}

export type StudentSingleCourseMenuType = {
  name: string,
  layout: string,
  path: string,
  icon: React.ReactNode,
}