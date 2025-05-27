<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParentIndustry;
use App\Models\ChildIndustry;

class IndustrySeeder extends Seeder
{
    public function run()
    {
        $industries = [
            'Technology' => ['Software Development', 'Hardware Manufacturing', 'IT Services', 'Telecommunications'],
            'Healthcare' => ['Hospitals', 'Pharmaceuticals', 'Medical Devices', 'Health Insurance'],
            'Finance' => ['Banking', 'Insurance', 'Investment', 'Fintech'],
            'Retail' => ['E-commerce', 'Brick & Mortar', 'Wholesale', 'Luxury Goods'],
            'Education' => ['Schools', 'Universities', 'Online Learning', 'Educational Technology'],
            'Manufacturing' => ['Automotive', 'Electronics', 'Textiles', 'Heavy Machinery'],
            'Hospitality' => ['Hotels', 'Restaurants', 'Travel', 'Tourism'],
            'Real Estate' => ['Residential', 'Commercial', 'Property Management', 'Construction'],
            'Entertainment' => ['Film & TV', 'Music', 'Gaming', 'Live Events'],
            'Other' => []
        ];

        foreach ($industries as $parent => $children) {
            $parentIndustry = ParentIndustry::create(['name' => $parent]);
            
            foreach ($children as $child) {
                ChildIndustry::create([
                    'parent_industry_id' => $parentIndustry->id,
                    'name' => $child
                ]);
            }
        }
    }
}