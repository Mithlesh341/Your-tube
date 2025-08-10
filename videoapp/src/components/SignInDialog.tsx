// components/SignInDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/AuthContext";

export default function SignInDialog() {
  const { user, loading, handlegooglesignin } = useUser();

  return (
    <Dialog open={!loading && !user}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            You must be signed in to use this app.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={handlegooglesignin}>Sign in with Google</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
