<?php

namespace App\Enums;

enum FollowUpType: string
{
    case CALL = 'call';
    case MEETING = 'meeting';
    case NOTE = 'note';
}
