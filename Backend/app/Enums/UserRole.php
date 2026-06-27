<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SALES_REP = 'sales_rep';
    case CUSTOMER_SERVICE = 'customer_service';

}
