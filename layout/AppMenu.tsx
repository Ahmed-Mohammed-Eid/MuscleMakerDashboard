/* eslint-disable @next/next/no-img-element */
import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';
import {AppMenuItem} from '../types/types';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'}]
        },
        {
            label: 'Packages',
            icon: 'pi pi-list',
            items: [
                {
                    label: 'Packages List',
                    icon: 'pi pi-fw pi-list',
                    to: '/packages',
                },
                {
                    label: 'Create Package',
                    icon: 'pi pi-fw pi-plus',
                    to: '/packages/create',
                }
            ]
        },
        {
            label: 'Meals',
            icon: 'pi pi-fw pi-list',
            items: [
                {
                    label: 'Meals List',
                    icon: 'pi pi-fw pi-list',
                    to: '/meals',
                },
                {
                    label: 'Create Meal',
                    icon: 'pi pi-fw pi-plus',
                    to: '/meals/create',
                }
            ]
        },
        {
            label: "Menu Settings",
            icon: "pi pi-fw pi-cog",
            items: [
                {
                    label: "Default Menu",
                    icon: "pi pi-fw pi-calendar",
                    to: "/menu/default",
                },
                {
                    label: "Chef Menu",
                    icon: "pi pi-fw pi-calendar",
                    to: "/menu/chef",
                }
            ]
        },
        {
            label: "Day Boxes List",
            icon: "pi pi-fw pi-list",
            items: [
                {
                    label: "Day Boxes List",
                    icon: "pi pi-fw pi-list",
                    to: "/dayboxes",
                },
                {
                    label: "Create Day Box",
                    icon: "pi pi-fw pi-plus",
                    to: "/dayboxes/create",
                }
            ]
        },
        {
            label: "Users",
            icon: "pi pi-fw pi-users",
            items: [
                {
                    label: "Users List",
                    icon: "pi pi-fw pi-list",
                    to: "/users",
                }
            ]
        },
        {
            label: "Branches",
            icon: "pi pi-fw pi-home",
            items: [
                {
                    label: "Branches List",
                    icon: "pi pi-fw pi-list",
                    to: "/branches",
                }
            ]
        },
        {
            label: "UI Management",
            icon: "pi pi-fw pi-cog",
            items: [
                {
                    label: "Sliders",
                    icon: "pi pi-fw pi-cog",
                    to: "/ui/sliders",
                },
                {
                    label : 'Add Slider',
                    icon : 'pi pi-fw pi-plus',
                    to : '/ui/sliders/add'
                }
            ]
        },
        {
            label: "Reports",
            icon: "pi pi-fw pi-chart-bar",
            items: [
                {
                    label: "Reports List",
                    icon: "pi pi-fw pi-list",
                    to: "/reports",
                },
                {
                    label: 'Daily Meals Report',
                    icon: 'pi pi-fw pi-list',
                    to: '/meals-report',
                }
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
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
