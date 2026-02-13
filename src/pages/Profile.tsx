
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"; // This is the only change
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`full_name, avatar_url`)
          .eq('id', user.id)
          .single();

        if (!ignore && !error && data) {
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.warn('Error fetching profile:', error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    getProfile();

    return () => { ignore = true; };
  }, [user]);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setUpdating(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date(),
    });

    if (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully!' });
    }
    setUpdating(false);
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;

      setAvatarUrl(newAvatarUrl);
      const { error: updateError } = await supabase.from('profiles').upsert({ id: user.id, avatar_url: newAvatarUrl });
      if (updateError) throw updateError;

      toast({ title: 'Avatar updated!' });
    } catch (error: any) {
      toast({ title: 'Error uploading avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>Update your personal details and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-background ring-2 ring-primary">
                  <AvatarImage src={avatarUrl} alt="User avatar" />
                  <AvatarFallback className="text-3xl">{fullName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={updating || uploading}>
                {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
