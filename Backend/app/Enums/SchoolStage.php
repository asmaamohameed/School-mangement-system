<?php

namespace App\Enums;

enum SchoolStage: string
{
    case LEAD = 'lead';
    case QUALIFIED = 'qualified';
    case INTERESTED = 'interested';
    case FOLLOW_UP = 'follow_up';
    case WON = 'won';
    case LOST = 'lost';
}
