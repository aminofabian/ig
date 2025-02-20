import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function SystemSettings() {
  const [disableSubscriptionPopup, setDisableSubscriptionPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setDisableSubscriptionPopup(data.disableSubscriptionPopup || false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setIsLoading(false);
    }
  };

  const handleToggleSubscriptionPopup = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disableSubscriptionPopup: !disableSubscriptionPopup
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setDisableSubscriptionPopup(data.disableSubscriptionPopup);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Manage global system settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Switch
              id="disable-subscription-popup"
              checked={disableSubscriptionPopup}
              onCheckedChange={handleToggleSubscriptionPopup}
              disabled={isSaving}
            />
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              disableSubscriptionPopup 
                ? "bg-green-500/10 text-green-500" 
                : "bg-yellow-500/10 text-yellow-500"
            }`}>
              {disableSubscriptionPopup ? "Disabled" : "Enabled"}
            </span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="disable-subscription-popup">
              Subscription Popup is {disableSubscriptionPopup ? "disabled" : "enabled"} for all users
            </Label>
            <p className="text-sm text-muted-foreground">
              {disableSubscriptionPopup ? 
                "✓ Subscription popup is currently disabled for all users" : 
                "✗ Subscription popup is currently enabled for users without active subscriptions"}
            </p>
            {isSaving && <p className="text-sm text-muted-foreground">Saving...</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
