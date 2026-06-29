<?php

namespace App\Http\Controllers\Api;

use App\Enums\FollowUpStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\FollowUp;
use App\Models\School;
use App\Models\Visit;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Representive dashboard
        if ($user->role === UserRole::SALES_REP) {

            return response()->json([
                'dashboard_type' => 'sales_rep',
                'visits_count' => Visit::where('rep_id', $user->id)->count(),
                'leads_count' => School::where('assigned_to', $user->id)->where('stage', 'lead')->count(),
            ]);
        }
        // Customer Service dashboard
        if ($user->role === UserRole::CUSTOMER_SERVICE) {

            return response()->json([
                'dashboard_type' => 'customer_service',
                'pending_follow_ups' => FollowUp::where('status', FollowUpStatus::PENDING)->count(),
            ]);
        }
        // Admin/Manager dashboard
        if ($user->role === UserRole::ADMIN) {
            $totalSchools = School::count();
            $totalLeads = School::where('stage', 'lead')->count();

            $totalCustomers = School::where('stage', 'won')->count();

            $conversionRate = $totalLeads > 0 ? round(($totalCustomers / $totalLeads) * 100, 1) : 0;

            return response()->json([
                'dashboard_type' => 'management_admin',
                'total_schools' => $totalSchools,
                'total_leads' => $totalLeads,
                'total_customers' => $totalCustomers,
                'conversion_rate' => $conversionRate.'%',
            ]);
        }

        return response()->json([
            'message' => 'Invalid dashboard',
        ], 403);
    }
}
