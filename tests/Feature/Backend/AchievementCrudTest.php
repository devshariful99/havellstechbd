<?php

use App\Models\Achievement;
use App\Models\Admin;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

test('guests cannot reach the achievement admin screens', function () {
    $this->get(route('admin.achievement.index'))->assertRedirect(route('admin.login'));
});

test('admins can list achievements', function () {
    Achievement::factory()->count(3)->create();

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.achievement.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Achievement/Index')
            ->has('achievements', 3));
});

test('admins can create an achievement', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.achievement.store'), [
            'icon' => 'trophy',
            'value' => 500,
            'suffix' => '+',
            'title' => 'Awards Won',
            'sort_order' => 3,
        ])
        ->assertRedirect(route('admin.achievement.index'))
        ->assertSessionHas('success');

    $achievement = Achievement::sole();

    expect($achievement->icon)->toBe('trophy')
        ->and($achievement->value)->toBe(500)
        ->and($achievement->suffix)->toBe('+')
        ->and($achievement->title)->toBe('Awards Won')
        ->and($achievement->sort_order)->toBe(3);
});

test('achievement creation requires icon value and title', function () {
    $this->actingAs($this->admin, 'admin')
        ->post(route('admin.achievement.store'), [])
        ->assertSessionHasErrors(['icon', 'value', 'title']);

    expect(Achievement::count())->toBe(0);
});

test('admins can update an achievement', function () {
    $achievement = Achievement::factory()->create([
        'title' => 'Old Title',
        'value' => 10,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.achievement.update', $achievement), [
            'icon' => 'smile',
            'value' => 100,
            'suffix' => '%',
            'title' => 'Customer Satisfaction',
            'sort_order' => 4,
        ])
        ->assertRedirect(route('admin.achievement.index'));

    $achievement->refresh();

    expect($achievement->icon)->toBe('smile')
        ->and($achievement->value)->toBe(100)
        ->and($achievement->suffix)->toBe('%')
        ->and($achievement->title)->toBe('Customer Satisfaction');
});

test('admins can delete an achievement', function () {
    $achievement = Achievement::factory()->create();

    $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.achievement.destroy', $achievement))
        ->assertRedirect(route('admin.achievement.index'));

    expect(Achievement::count())->toBe(0);
});
