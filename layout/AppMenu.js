import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';

const AppMenu = () => {

    const model = [
        {
            label: 'Home',
            items: [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'},
            ]
        },
        {
            label: 'Categories',
            items: [
                {label: 'Categories', icon: 'pi pi-list', to: '/categories'},
                {label: 'Add Category', icon: 'pi pi-plus', to: '/categories/add'},
            ]
        },
        {
            label: 'Clients',
            items: [
                {label: "Users Review", icon: "pi pi-list", to: "/users/reviews"},
                {label: 'Clients List', icon: 'pi pi-users', to: '/users'},
                {label: "Add Content To Client", icon: "pi pi-plus", to: "/users/add"},
            ]
        },
        {
            label: 'Courses',
            items: [
                {label: 'Courses List', icon: 'pi pi-list', to: '/courses'},
                {label: 'Add Course', icon: 'pi pi-plus', to: '/courses/add'},
            ]
        },
        {
            label: 'Media',
            items: [
                {label: 'Media List', icon: 'pi pi-list', to: '/media'},
                {label: 'Add Media', icon: 'pi pi-plus', to: '/media/add'},
            ]
        },
        {
            label: 'Reports',
            items: [
                {label: 'Reports List', icon: 'pi pi-list', to: '/reports'},
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
