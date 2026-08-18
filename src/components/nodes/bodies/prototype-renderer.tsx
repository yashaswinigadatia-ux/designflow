import { useState } from 'react';

import {
    Home,
    User,
    Settings,
    Eye,
    Menu,
    ArrowRight,
    Check,
    LogOut,
} from 'lucide-react';

import type {
    ComponentType,
    LayoutType,
} from '@/workflow/workflow-types';


export interface PrototypeData {
    readonly prototypeName?: string;
    readonly version?: string;

    readonly screenName?: string;
    readonly screenType?: string;
    readonly description?: string;
    readonly layout?: LayoutType;

    readonly componentType?: ComponentType;
    readonly variant?: string;
    readonly label?: string;

    readonly navigationPosition?: string;
    readonly logo?: string;
    readonly menuItems?: string;
}


interface PrototypeRendererProps {
    readonly data: PrototypeData;
    readonly fullscreen?: boolean;
}


type PrototypeScreen =
    | 'Login'
    | 'Home'
    | 'Profile'
    | 'Settings';


function getMenuItems(
    value?: string,
): string[] {

    if (!value || typeof value !== 'string') {
        return [
            'Home',
            'Profile',
            'Settings',
        ];
    }

    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}


function renderMenuIcon(
    item: string,
) {

    const normalized =
        item.toLowerCase();

    if (normalized.includes('home')) {
        return <Home className="size-4" />;
    }

    if (
        normalized.includes('profile') ||
        normalized.includes('user')
    ) {
        return <User className="size-4" />;
    }

    if (normalized.includes('setting')) {
        return <Settings className="size-4" />;
    }

    return <Menu className="size-4" />;
}


function getButtonText(
    data: PrototypeData,
): string {

    if (data.label?.trim()) {
        return data.label;
    }

    if (data.screenType === 'Login') {
        return 'Login';
    }

    return 'Continue';
}


function isMobile(
    layout?: LayoutType,
): boolean {

    return (
        layout === 'Mobile' ||
        !layout
    );
}


function normalizeScreen(
    value: string,
): PrototypeScreen {

    const screen =
        value.toLowerCase();

    if (screen.includes('profile')) {
        return 'Profile';
    }

    if (screen.includes('setting')) {
        return 'Settings';
    }

    if (screen.includes('home')) {
        return 'Home';
    }

    return 'Login';
}


function TopNavigation({
    data,
    currentScreen,
    onNavigate,
}: {
    readonly data: PrototypeData;
    readonly currentScreen: PrototypeScreen;
    readonly onNavigate: (
        screen: PrototypeScreen,
    ) => void;
}) {

    const items =
        getMenuItems(data.menuItems);

    return (
        <header
            className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-5
                py-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    font-semibold
                    text-slate-900
                "
            >

                <div
                    className="
                        grid
                        size-8
                        place-items-center
                        rounded-lg
                        bg-violet-600
                        text-white
                    "
                >
                    <span className="text-sm font-bold">
                        D
                    </span>
                </div>

                <span>
                    {data.logo || 'DesignFlow'}
                </span>

            </div>


            <nav
                className="
                    hidden
                    items-center
                    gap-5
                    md:flex
                "
            >

                {items.map(item => {

                    const target =
                        normalizeScreen(item);

                    const active =
                        currentScreen === target;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                onNavigate(target)
                            }
                            className={`
                                flex
                                items-center
                                gap-2
                                text-sm
                                transition-colors
                                ${
                                    active
                                        ? 'font-semibold text-violet-600'
                                        : 'text-slate-600 hover:text-slate-950'
                                }
                            `}
                        >
                            {renderMenuIcon(item)}
                            {item}
                        </button>
                    );
                })}

            </nav>


            <button
                type="button"
                className="
                    grid
                    size-9
                    place-items-center
                    rounded-lg
                    text-slate-600
                    hover:bg-slate-100
                    md:hidden
                "
            >
                <Menu className="size-5" />
            </button>

        </header>
    );
}


function BottomNavigation({
    data,
    currentScreen,
    onNavigate,
}: {
    readonly data: PrototypeData;
    readonly currentScreen: PrototypeScreen;
    readonly onNavigate: (
        screen: PrototypeScreen,
    ) => void;
}) {

    const items =
        getMenuItems(data.menuItems);

    return (
        <nav
            className="
                flex
                shrink-0
                items-center
                justify-around
                border-t
                border-slate-200
                bg-white
                px-2
                py-3
            "
        >

            {items.slice(0, 4).map(item => {

                const target =
                    normalizeScreen(item);

                const active =
                    currentScreen === target;

                return (
                    <button
                        key={item}
                        type="button"
                        onClick={() =>
                            onNavigate(target)
                        }
                        className={`
                            flex
                            min-w-16
                            flex-col
                            items-center
                            gap-1
                            text-[11px]
                            transition-colors
                            ${
                                active
                                    ? 'font-semibold text-violet-600'
                                    : 'text-slate-500'
                            }
                        `}
                    >
                        {renderMenuIcon(item)}

                        <span>
                            {item}
                        </span>
                    </button>
                );
            })}

        </nav>
    );
}


function LoginScreen({
    data,
    onLogin,
}: {
    readonly data: PrototypeData;
    readonly onLogin: () => void;
}) {

    const buttonText =
        getButtonText(data);

    return (
        <div
            className="
                flex
                min-h-0
                flex-1
                flex-col
                justify-center
                overflow-auto
                px-6
                py-10
            "
        >

            <div className="mx-auto w-full max-w-md">

                <div
                    className="
                        mb-8
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-5
                            grid
                            size-14
                            place-items-center
                            rounded-2xl
                            bg-violet-100
                            text-violet-600
                        "
                    >
                        <span className="text-xl font-bold">
                            D
                        </span>
                    </div>


                    <h1
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Welcome Back! 👋
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        {data.description ||
                            'Please login to continue to your account.'}
                    </p>

                </div>


                <div className="space-y-4">

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-slate-600
                            "
                        >
                            Email address
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                outline-none
                                focus:border-violet-500
                                focus:ring-2
                                focus:ring-violet-100
                            "
                        />

                    </div>


                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-slate-600
                            "
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                outline-none
                                focus:border-violet-500
                                focus:ring-2
                                focus:ring-violet-100
                            "
                        />

                    </div>


                    <button
                        type="button"
                        onClick={onLogin}
                        className="
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-violet-600
                            px-4
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-violet-700
                            active:scale-[0.99]
                        "
                    >
                        {buttonText}

                        <ArrowRight className="size-4" />
                    </button>


                    <button
                        type="button"
                        className="
                            w-full
                            text-center
                            text-xs
                            text-violet-600
                            hover:underline
                        "
                    >
                        Forgot password?
                    </button>

                </div>

            </div>

        </div>
    );
}


function HomeScreen({
    data,
    onNavigate,
}: {
    readonly data: PrototypeData;
    readonly onNavigate: (
        screen: PrototypeScreen,
    ) => void;
}) {

    const buttonText =
        getButtonText(data);

    return (
        <div
            className="
                flex-1
                overflow-auto
                bg-slate-50
                px-5
                py-8
            "
        >

            <div className="mx-auto max-w-3xl">

                <div className="mb-7">

                    <p
                        className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-violet-600
                        "
                    >
                        Dashboard
                    </p>

                    <h1
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {data.screenName || 'Home Screen'}
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        {data.description ||
                            'Welcome to your dashboard.'}
                    </p>

                </div>


                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-3
                    "
                >

                    {[
                        ['Projects', '12'],
                        ['Tasks', '28'],
                        ['Completed', '84%'],
                    ].map(([title, value]) => (
                        <div
                            key={title}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {title}
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {value}
                            </p>

                        </div>
                    ))}

                </div>


                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                Quick action
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {data.description ||
                                    'Continue working on your project.'}
                            </p>

                        </div>

                        <Check className="size-5 text-green-500" />

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            onNavigate('Profile')
                        }
                        className="
                            mt-5
                            rounded-lg
                            bg-violet-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-violet-700
                        "
                    >
                        {buttonText}
                    </button>

                </div>

            </div>

        </div>
    );
}


function ProfileScreen({
    onLogout,
}: {
    readonly onLogout: () => void;
}) {

    return (
        <div
            className="
                flex
                flex-1
                flex-col
                overflow-auto
                bg-slate-50
                px-5
                py-8
            "
        >

            <div className="mx-auto w-full max-w-2xl">

                <div className="mb-6">

                    <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
                        Account
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Profile
                    </h1>

                </div>


                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                grid
                                size-16
                                place-items-center
                                rounded-full
                                bg-violet-100
                                text-violet-600
                            "
                        >
                            <User className="size-7" />
                        </div>


                        <div>

                            <h2 className="font-semibold text-slate-900">
                                DesignFlow User
                            </h2>

                            <p className="text-sm text-slate-500">
                                user@example.com
                            </p>

                        </div>

                    </div>


                    <div className="mt-6 grid gap-3 sm:grid-cols-2">

                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Account type
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                Designer
                            </p>
                        </div>


                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Status
                            </p>

                            <p className="mt-1 text-sm font-medium text-green-600">
                                Active
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onLogout}
                        className="
                            mt-6
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-200
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-50
                        "
                    >
                        <LogOut className="size-4" />
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}


function SettingsScreen() {

    return (
        <div
            className="
                flex
                flex-1
                overflow-auto
                bg-slate-50
                px-5
                py-8
            "
        >

            <div className="mx-auto w-full max-w-2xl">

                <div className="mb-6">

                    <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
                        Preferences
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Settings
                    </h1>

                </div>


                <div className="space-y-3">

                    {[
                        ['Notifications', 'Receive product notifications'],
                        ['Dark mode', 'Use dark appearance'],
                        ['Analytics', 'Share anonymous usage data'],
                    ].map(([title, description]) => (
                        <div
                            key={title}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div>

                                <p className="text-sm font-medium text-slate-900">
                                    {title}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {description}
                                </p>

                            </div>


                            <div
                                className="
                                    relative
                                    h-6
                                    w-11
                                    rounded-full
                                    bg-violet-600
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        right-1
                                        top-1
                                        size-4
                                        rounded-full
                                        bg-white
                                    "
                                />

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}


function GenericScreen({
    data,
}: {
    readonly data: PrototypeData;
}) {

    return (
        <div
            className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                overflow-auto
                px-6
                text-center
            "
        >

            <div
                className="
                    mb-5
                    grid
                    size-14
                    place-items-center
                    rounded-2xl
                    bg-violet-100
                    text-violet-600
                "
            >
                <Eye className="size-6" />
            </div>


            <h1
                className="
                    text-2xl
                    font-bold
                    text-slate-900
                "
            >
                {data.screenName || 'Prototype Screen'}
            </h1>


            <p
                className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                "
            >
                {data.description ||
                    'Your generated prototype screen.'}
            </p>

        </div>
    );
}


export function PrototypeRenderer({
    data,
    fullscreen = false,
}: PrototypeRendererProps) {

    const [currentScreen, setCurrentScreen] =
        useState<PrototypeScreen>(
            normalizeScreen(
                data.screenType || 'Login',
            ),
        );


    const mobile =
        isMobile(data.layout);


    const navigation =
        data.navigationPosition?.toLowerCase() ||
        'top';


    function navigate(
        screen: PrototypeScreen,
    ) {
        setCurrentScreen(screen);
    }


    function renderScreen() {

        switch (currentScreen) {

            case 'Login':
                return (
                    <LoginScreen
                        data={data}
                        onLogin={() =>
                            navigate('Home')
                        }
                    />
                );


            case 'Home':
                return (
                    <HomeScreen
                        data={data}
                        onNavigate={navigate}
                    />
                );


            case 'Profile':
                return (
                    <ProfileScreen
                        onLogout={() =>
                            navigate('Login')
                        }
                    />
                );


            case 'Settings':
                return <SettingsScreen />;


            default:
                return (
                    <GenericScreen
                        data={data}
                    />
                );
        }
    }


    return (
        <div
            className={`
                flex
                min-h-0
                flex-col
                overflow-hidden
                bg-slate-100
                text-slate-900
                ${fullscreen ? 'h-full' : ''}
            `}
        >

            {/* Browser header */}

            <div
                className="
                    flex
                    h-10
                    shrink-0
                    items-center
                    gap-2
                    border-b
                    border-slate-200
                    bg-white
                    px-4
                "
            >

                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-green-400" />


                <div
                    className="
                        ml-3
                        flex-1
                        rounded-md
                        bg-slate-100
                        px-3
                        py-1
                        text-[10px]
                        text-slate-400
                    "
                >
                    localhost /{' '}
                    {data.prototypeName || 'prototype'}
                </div>

            </div>


            {/* Prototype */}

            <div
                className="
                    flex
                    min-h-0
                    flex-1
                    justify-center
                    overflow-auto
                    bg-slate-200
                    p-4
                    sm:p-8
                "
            >

                <div
                    className={`
                        flex
                        min-h-[520px]
                        w-full
                        flex-col
                        overflow-hidden
                        bg-white
                        shadow-2xl
                        ${
                            mobile
                                ? 'max-w-[430px] rounded-[28px] border-[6px] border-slate-900'
                                : 'max-w-6xl rounded-xl border border-slate-300'
                        }
                    `}
                >

                    {navigation === 'bottom'
                        ? (
                            <>
                                {renderScreen()}

                                <BottomNavigation
                                    data={data}
                                    currentScreen={currentScreen}
                                    onNavigate={navigate}
                                />
                            </>
                        )
                        : (
                            <>
                                {currentScreen !== 'Login' && (
                                    <TopNavigation
                                        data={data}
                                        currentScreen={currentScreen}
                                        onNavigate={navigate}
                                    />
                                )}

                                {renderScreen()}
                            </>
                        )}

                </div>

            </div>

        </div>
    );
}