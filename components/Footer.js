"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTranslations } from "@/contexts/I18nContext";

import styles from "./Footer.module.css";

export default function Footer() {
  const { user } = useAuth();
  const t = useAppTranslations("footer");
  const tNav = useAppTranslations("navbar");
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
            <p className={styles.description}>{t("description")}</p>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t("quickLinks")}</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.link}>
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/detect" className={styles.link}>
                  {t("detection")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className={styles.link}>
                  {tNav("dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  {tNav("awareness")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t("resources")}</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/awareness" className={styles.link}>
                  {t("diseaseGuide")}
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  {t("preventionTips")}
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  {t("bestPractices")}
                </Link>
              </li>
              <li>
                <Link href="/awareness" className={styles.link}>
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t("contact")}</h4>
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
            © {currentYear} AgroCare. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
