<?php

namespace App\Policies;

use App\Models\User;
use App\Models\SocialLink;

class SocialLinkPolicy
{
    public function update(User $user, SocialLink $socialLink)
    {
        return $user->id === $socialLink->user_id;
    }

    public function delete(User $user, SocialLink $socialLink)
    {
        return $user->id === $socialLink->user_id;
    }
} 