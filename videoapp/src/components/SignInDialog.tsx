"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/AuthContext";


export default function SignInDialog({ open }: { open: boolean }) {
  const { handlegooglesignin } = useUser();

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In Required</DialogTitle>
        </DialogHeader>
        <p className="mb-4">Please sign in to continue using the site.</p>
        <Button onClick={handlegooglesignin}>Sign in with Google</Button>
      </DialogContent>
    </Dialog>
  );
}