<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-6 bg-white rounded-lg shadow-md">
    {skills.map(skill => (
        <div key={skill.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="w-6 h-6 text-blue-500">{skill.icon}</div>
            <span className="text-sm font-medium text-gray-900">{skill.name}</span>
        </div>
    ))}
</div> 