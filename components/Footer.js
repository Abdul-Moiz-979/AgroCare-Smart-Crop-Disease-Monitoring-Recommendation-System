"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

import styles from "./Footer.module.css";

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  // Don't show footer if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About Section */}
          <div className={styles.section}>
            <div className={styles.heading}>
              <Image
                src="/AgroCare_logo.png"
                alt="AgroCare Logo"
                width={120}
                height={120}
                className={styles.logoImage}
                style={{ mixBlendMode: "multiply" }}
              />
              <span>AgroCare</span>
            </div>
            <p className={styles.description}>
              Advanced crop disease detection using cutting-edge technology to
              help farmers protect their crops and maximize yields.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/detect" className={styles.link}>
                  Disease Detection
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className={styles.link}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  Awareness
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/awareness" className={styles.link}>
                  Disease Guide
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  Prevention Tips
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  Best Practices
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Contact</h4>
            <ul className={styles.linkList}>
              <li className={styles.contactItem}>
                <span>📧</span>
                <span>support.agrocare@gmail.com</span>
              </li>
              <li className={styles.contactItem}>
                <span>📍</span>
                <span>Haripur, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} AgroCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
