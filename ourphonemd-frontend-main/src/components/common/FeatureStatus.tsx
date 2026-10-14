"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Wrench } from "lucide-react";

interface FeatureStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: "coming-soon" | "currently-unavailable";
  featureName: string;
  description: string;
  missingDependency?: string;
}

export function FeatureStatusModal({
  open,
  onOpenChange,
  title,
  type,
  featureName,
  description,
  missingDependency,
}: FeatureStatusModalProps) {
  const isComingSoon = type === "coming-soon";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {isComingSoon ? (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Currently Unavailable
              </Badge>
            )}
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title || featureName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        {missingDependency && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Wrench className="w-3.5 h-3.5 text-customTeal" />
              <span>Pending Backend Integration:</span>
            </div>
            <p className="font-mono text-slate-500 break-all">{missingDependency}</p>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            className="bg-customTeal hover:bg-customTeal/90 text-white w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Acknowledge & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FeatureStatusBannerProps {
  type: "coming-soon" | "currently-unavailable";
  title: string;
  description: string;
  missingDependency?: string;
  actionText?: string;
  actionHref?: string;
}

export function FeatureStatusBanner({
  type,
  title,
  description,
  missingDependency,
  actionText,
  actionHref,
}: FeatureStatusBannerProps) {
  const isComingSoon = type === "coming-soon";

  return (
    <div className="border rounded-xl p-8 text-center max-w-2xl mx-auto bg-white shadow-sm space-y-4">
      <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-50 text-customTeal mb-1">
        {isComingSoon ? <Clock className="w-8 h-8" /> : <Wrench className="w-8 h-8" />}
      </div>

      <div className="inline-block">
        <Badge
          className={
            isComingSoon
              ? "bg-blue-100 text-blue-700 border-blue-200"
              : "bg-amber-100 text-amber-800 border-amber-200"
          }
        >
          {isComingSoon ? "Coming Soon" : "Currently Unavailable"}
        </Badge>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 max-w-lg mx-auto">{description}</p>

      {missingDependency && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-w-md mx-auto text-xs text-slate-600 text-left space-y-1">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Wrench className="w-3.5 h-3.5 text-customTeal" />
            <span>Required Backend Service:</span>
          </div>
          <p className="font-mono text-slate-500">{missingDependency}</p>
        </div>
      )}

      {actionText && actionHref && (
        <div className="pt-2">
          <a href={actionHref}>
            <Button className="bg-customTeal hover:bg-customTeal/90 text-white">
              {actionText}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
