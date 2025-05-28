<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SkillsAchievementsSeeder extends Seeder
{
    public function run()
    {
        // Skills data
        $skills = [
            // Technical Skills
            ['name' => 'PHP', 'description' => 'Server-side scripting language'],
            ['name' => 'Laravel', 'description' => 'PHP framework'],
            ['name' => 'JavaScript', 'description' => 'Client-side scripting'],
            ['name' => 'Vue.js', 'description' => 'JavaScript framework'],
            ['name' => 'React', 'description' => 'JavaScript library'],
            ['name' => 'Node.js', 'description' => 'JavaScript runtime'],
            ['name' => 'Python', 'description' => 'General-purpose programming'],
            ['name' => 'Django', 'description' => 'Python web framework'],
            ['name' => 'MySQL', 'description' => 'Relational database'],
            ['name' => 'PostgreSQL', 'description' => 'Advanced relational database'],
            ['name' => 'MongoDB', 'description' => 'NoSQL database'],
            ['name' => 'Docker', 'description' => 'Containerization'],
            ['name' => 'AWS', 'description' => 'Cloud computing services'],
            ['name' => 'Git', 'description' => 'Version control'],
            ['name' => 'REST API', 'description' => 'API design'],
            ['name' => 'GraphQL', 'description' => 'Query language'],
            ['name' => 'HTML5', 'description' => 'Markup language'],
            ['name' => 'CSS3', 'description' => 'Styling language'],
            ['name' => 'SASS', 'description' => 'CSS preprocessor'],
            ['name' => 'Bootstrap', 'description' => 'CSS framework'],
            
            // Soft Skills
            ['name' => 'Communication', 'description' => 'Verbal and written'],
            ['name' => 'Teamwork', 'description' => 'Collaboration skills'],
            ['name' => 'Problem Solving', 'description' => 'Analytical thinking'],
            ['name' => 'Leadership', 'description' => 'Team guidance'],
            ['name' => 'Time Management', 'description' => 'Task prioritization'],
            ['name' => 'Adaptability', 'description' => 'Flexibility'],
            ['name' => 'Creativity', 'description' => 'Innovative thinking'],
            ['name' => 'Work Ethic', 'description' => 'Professionalism'],
            ['name' => 'Attention to Detail', 'description' => 'Precision'],
            ['name' => 'Conflict Resolution', 'description' => 'Mediation'],
            
            // Business Skills
            ['name' => 'Project Management', 'description' => 'Task coordination'],
            ['name' => 'Agile Methodology', 'description' => 'Scrum/Kanban'],
            ['name' => 'Strategic Planning', 'description' => 'Long-term vision'],
            ['name' => 'Financial Analysis', 'description' => 'Budgeting'],
            ['name' => 'Marketing', 'description' => 'Promotion'],
            ['name' => 'Sales', 'description' => 'Revenue generation'],
            ['name' => 'Customer Service', 'description' => 'Client relations'],
            ['name' => 'Negotiation', 'description' => 'Deal making'],
            ['name' => 'Public Speaking', 'description' => 'Presentations'],
            ['name' => 'Data Analysis', 'description' => 'Metrics interpretation'],
        ];

        // Achievements data
        $achievements = [
            // Technical Achievements
            ['title' => 'Certified Laravel Developer', 'description' => 'Official Laravel certification'],
            ['title' => 'AWS Certified Solutions Architect', 'description' => 'AWS professional certification'],
            ['title' => 'Open Source Contributor', 'description' => 'Contributed to major open source projects'],
            ['title' => 'Published NPM Package', 'description' => 'Created a popular NPM package'],
            ['title' => 'Hackathon Winner', 'description' => 'Won a coding competition'],
            ['title' => 'Tech Conference Speaker', 'description' => 'Presented at a major conference'],
            ['title' => 'Technical Book Author', 'description' => 'Published a technical book'],
            ['title' => 'Patent Holder', 'description' => 'Holds a technology patent'],
            ['title' => 'Million Downloads', 'description' => 'Software with 1M+ downloads'],
            ['title' => 'Performance Optimization Expert', 'description' => 'Significantly improved system performance'],
            
            // Professional Achievements
            ['title' => 'Employee of the Year', 'description' => 'Recognized as top performer'],
            ['title' => 'Promoted to Senior Position', 'description' => 'Advanced to senior role'],
            ['title' => 'Successful Product Launch', 'description' => 'Led a product to market'],
            ['title' => 'Revenue Growth Achievement', 'description' => 'Significantly increased revenue'],
            ['title' => 'Cost Reduction Initiative', 'description' => 'Reduced operational costs'],
            ['title' => 'Team Building Success', 'description' => 'Built high-performing team'],
            ['title' => 'Client Satisfaction Award', 'description' => 'Recognized for client service'],
            ['title' => 'Mentorship Program Leader', 'description' => 'Guided junior team members'],
            ['title' => 'Process Improvement', 'description' => 'Optimized business processes'],
            ['title' => 'International Expansion', 'description' => 'Helped expand business globally'],
            
            // Educational Achievements
            ['title' => 'Advanced Degree Earned', 'description' => 'Completed master\'s or PhD'],
            ['title' => 'Summa Cum Laude', 'description' => 'Graduated with highest honors'],
            ['title' => 'Research Publication', 'description' => 'Published in academic journal'],
            ['title' => 'Professional Certification', 'description' => 'Earned industry certification'],
            ['title' => 'Continuing Education', 'description' => 'Completed advanced training'],
            ['title' => 'Technical Training Instructor', 'description' => 'Taught professional courses'],
            ['title' => 'Thesis Award', 'description' => 'Recognized for academic work'],
            ['title' => 'Scholarship Recipient', 'description' => 'Awarded academic scholarship'],
            ['title' => 'Dean\'s List', 'description' => 'Academic excellence recognition'],
            ['title' => 'Honor Society Member', 'description' => 'Invited to join honor society'],
        ];

        // Insert skills
        foreach ($skills as $skill) {
            DB::table('skills')->insert([
                'name' => $skill['name'],
                'slug' => Str::slug($skill['name']),
                'description' => $skill['description'],
                'icon' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert achievements
        foreach ($achievements as $achievement) {
            DB::table('achievements')->insert([
                'title' => $achievement['title'],
                'slug' => Str::slug($achievement['title']),
                'description' => $achievement['description'],
                'icon' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Assign some skills and achievements to users (example for first 10 users)
        $users = \App\Models\User::limit(10)->get();
        $skillIds = \App\Models\Skill::pluck('id')->toArray();
        $achievementIds = \App\Models\Achievement::pluck('id')->toArray();

        foreach ($users as $user) {
            // Assign 5-10 random skills
            $userSkills = array_rand(array_flip($skillIds), rand(5, 10));
            foreach ((array)$userSkills as $skillId) {
                DB::table('user_skill')->insert([
                    'user_id' => $user->id,
                    'skill_id' => $skillId,
                    'proficiency' => rand(1, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Assign 3-5 random achievements
            $userAchievements = array_rand(array_flip($achievementIds), rand(3, 5));
            foreach ((array)$userAchievements as $achievementId) {
                DB::table('user_achievement')->insert([
                    'user_id' => $user->id,
                    'achievement_id' => $achievementId,
                    'achieved_at' => now()->subDays(rand(1, 365)),
                    'notes' => 'Automatically assigned by seeder',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}