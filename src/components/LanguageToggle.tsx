import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-medium">{isAr ? "EN" : "عربي"}</span>
    </Button>
  );
}
