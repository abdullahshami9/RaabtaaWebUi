const Navigation = ({ user }) => {
    const navigationItems = [
        {
            name: 'Dashboard',
            icon: <FaTachometerAlt className="w-5 h-5" />,
            route: route('dashboard'),
            visible: true
        },
        {
            name: 'Payments',
            icon: <FaMoneyBill className="w-5 h-5" />,
            route: route('payments'),
            visible: user.usage_type === 'business'
        },
        {
            name: 'Store',
            icon: <FaStore className="w-5 h-5" />,
            route: route('store'),
            visible: user.usage_type === 'business'
        },
        {
            name: 'Reminders',
            icon: <FaClock className="w-5 h-5" />,
            route: route('reminders'),
            visible: user.usage_type === 'business'
        },
    ];

    return (
        <nav className="space-y-1">
            {navigationItems
                .filter(item => item.visible)
                .map((item) => (
                    <Link
                        key={item.name}
                        href={item.route}
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                    </Link>
                ))}
        </nav>
    );
}; 