'use client';

import { useEffect, useState } from 'react';
import styles from './spinner.module.css'

export default function Spinner() {
    return (
        <div className={styles.page}>
            <div className={styles.loader}>
                <div className={styles.loadContainer}>
                    <div className={`${styles.loadInner}${styles.elasticPopIn}`}>
                        <div className={styles.loadCircle}>
                            <div className={styles.loadCircleInner}></div>
                        </div>
                        <div className={styles.loadCircle}>
                            <div className={styles.loadCircleInner}></div>
                        </div>
                        <div className={styles.loadCircle}>
                            <div className={styles.loadCircleInner}></div>
                        </div>
                        <div className={styles.loadCircle}>
                            <div className={styles.loadCircleInner}></div>
                        </div>
                        <div className={styles.loadCircle}>
                            <div className={styles.loadCircleInner}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
