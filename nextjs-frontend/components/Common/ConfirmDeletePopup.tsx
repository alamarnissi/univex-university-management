import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '@/components/ui/alert-dialog';
import { Trash2Icon } from 'lucide-react';
import { ReactNode, useState } from 'react';

type PopupProps = {
    icon?: ReactNode | string,
    iconSize?: number, 
    triggerButtonMessage?: string, 
    triggerTextColor?: string,
    confirmButtonMessage?: string,
    cancelButtonMessage?: string,
    alertHeading?: string, 
    alertMessage?: string, 
    handleAction: any
}


const ConfirmActionPopup = ({ icon, iconSize, triggerButtonMessage, triggerTextColor, confirmButtonMessage, cancelButtonMessage, alertHeading, alertMessage, handleAction}: PopupProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClickAction = async () => {
        setIsLoading(true);
        await handleAction();
        setIsLoading(false);
        return;
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                disabled={isLoading}
                className={`${triggerTextColor ? `text-[${triggerTextColor}] hover:text-[${triggerTextColor}]/90` : "text-red-500 hover:text-red-300"} disabled:cursor-not-allowed disabled:opacity-90 flex items-center gap-3 px-4 py-2 text-sm`}
            >
                {icon || <Trash2Icon size={iconSize || 20} />}
                {triggerButtonMessage || ""}
                {isLoading && <span className={`${triggerTextColor ? `!border-[${triggerTextColor}]` : "!border-red-500"} loading-spinner !border-t-white !w-3 !h-3 animate-spinner`}></span>}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alertHeading || "Are you absolutely sure?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {alertMessage || "This action cannot be undone. This will permanently delete the selected item!"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {cancelButtonMessage || "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClickAction}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {confirmButtonMessage || "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmActionPopup