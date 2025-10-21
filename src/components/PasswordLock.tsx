import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordLockProps {
  onUnlock: () => void;
}

const PasswordLock = ({ onUnlock }: PasswordLockProps) => {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === '1958') {
      onUnlock();
    } else {
      setIsShaking(true);
      toast.error('Incorrect password');
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card p-4">
      <div className={`w-full max-w-md space-y-8 animate-fade-in ${isShaking ? 'animate-shake' : ''}`}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse-glow">
            <Lock className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Ansh & Noahh
          </h1>
          <p className="text-muted-foreground">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center text-lg tracking-widest"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Unlock
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordLock;
