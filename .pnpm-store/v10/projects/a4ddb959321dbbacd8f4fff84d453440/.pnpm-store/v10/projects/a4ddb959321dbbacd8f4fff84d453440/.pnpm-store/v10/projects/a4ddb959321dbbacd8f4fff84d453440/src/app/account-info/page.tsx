// "use client";

import React from 'react';
import styles from './account.module.css';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountInfoPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Account Information</h1>
        <p className={styles.subtitle}>Update your personal details and manage your artisan profile.</p>

        <form>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="" 
              className={styles.inputField} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              value="" 
              disabled 
              className={`${styles.inputField} ${styles.inputDisabled}`} 
            />
            <p style={{fontSize: '12px', color: '#999', marginTop: '4px'}}>
              Email cannot be changed for security reasons.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Artisan Bio / About You</label>
            <textarea 
              rows={4} 
              placeholder="Tell your story to your customers..." 
              className={styles.inputField}
            ></textarea>
          </div>

          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}