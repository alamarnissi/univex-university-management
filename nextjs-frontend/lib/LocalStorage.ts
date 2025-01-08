"use client"

export function LocalStorage () {

    const remove = ({name}: {name: string}) => {
        localStorage.removeItem(name);
    }
    
    const set = ({name, value}: {name: string, value: any}) => {
        localStorage.setItem(name, value);
    }
    
    const get = ({name}: {name: string}) => {
        window.localStorage.getItem(name);
    }

    return {remove, set, get}
}