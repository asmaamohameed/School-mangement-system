<?php

namespace App\Enums;

enum VisitInterestLevel: string
{
    case Cold = 'Cold';
    case Warm = 'Warm';
    case Interested = 'Interested';
    case HighlyInterested = 'HighlyInterested';
}
