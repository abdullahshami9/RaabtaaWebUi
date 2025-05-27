export default function StepIndicator({ currentStep, totalSteps = 4 }) {
    return (
        <div className="flex justify-center mb-12">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        i + 1 === currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                        {i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                        <div className={`w-16 h-1 mx-2 transition-colors ${
                            i + 1 < currentStep
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
} 