<?php

namespace App\Enums;

enum FollowUpStatus: string
{
    case PENDING = 'pending';
    case NO_ANSWER = 'no_answer';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
