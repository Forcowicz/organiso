<?php

namespace App\Models;

use App\EisenhowerMatrix;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasUuids;

    public function eisenhowerMatrix(): Attribute
    {
        return Attribute::get(fn() => EisenhowerMatrix::fromBooleans(
            $this->is_important,
            $this->is_urgent
        ));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
