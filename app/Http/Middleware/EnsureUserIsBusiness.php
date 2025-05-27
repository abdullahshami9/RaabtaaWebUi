namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsBusiness
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->user()->usage_type !== 'business') {
            return redirect()->route('dashboard')->with('error', 'You do not have access to this page.');
        }

        return $next($request);
    }
} 