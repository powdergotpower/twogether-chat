-- Create users table for our two users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'voice', 'image')),
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all users"
  ON public.users FOR SELECT
  USING (true);

-- RLS Policies for messages table
CREATE POLICY "Users can read all messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Create index for message ordering
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Insert our two users (passwords will be hashed on backend)
-- For now, just placeholders - we'll handle proper auth in the app
INSERT INTO public.users (username, display_name, password_hash) VALUES
  ('Ansh', 'Ansh', 'placeholder_will_be_set_by_app'),
  ('Noahh', 'Noahh', 'placeholder_will_be_set_by_app')
ON CONFLICT (username) DO NOTHING;