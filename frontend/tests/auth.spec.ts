import { test, expect } from '@playwright/test'

test('signup and login flow', async ({ page }) => {
  // Open app
  await page.goto('/')
  // Switch to register
  await page.getByRole('button', { name: 'Sign up' }).click()
  // Fill registration form
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Register' }).click()
  // Should redirect to login
  await expect(page).toHaveURL(/\/login/)

  // Perform login
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  // Should land on dashboard
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('🌱')).toBeVisible()
})
