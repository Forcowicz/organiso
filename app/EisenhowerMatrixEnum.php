<?php

namespace App;

enum EisenhowerMatrix: string
{
    case IMPORTANT_URGENT = 'important_urgent';         // Q1
    case IMPORTANT_NOT_URGENT = 'important_not_urgent'; // Q2
    case NOT_IMPORTANT_URGENT = 'not_important_urgent'; // Q3
    case NOT_IMPORTANT_NOT_URGENT = 'not_important_not_urgent'; // Q4

    public static function fromBooleans(bool $isImportant, bool $isUrgent): self
    {
        return match (true) {
            $isImportant && $isUrgent => self::IMPORTANT_URGENT,
            $isImportant && !$isUrgent => self::IMPORTANT_NOT_URGENT,
            !$isImportant && $isUrgent => self::NOT_IMPORTANT_URGENT,
            default => self::NOT_IMPORTANT_NOT_URGENT,
        };
    }

    public function basePoints(): int
    {
        return match ($this) {
            self::IMPORTANT_NOT_URGENT => 40, // Q2 - Najcenniejsze
            self::IMPORTANT_URGENT => 30,     // Q1
            self::NOT_IMPORTANT_URGENT => 10, // Q3
            self::NOT_IMPORTANT_NOT_URGENT => 5, // Q4
        };
    }
}
