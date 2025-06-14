import { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import { Button, Input, Label, toast } from '@repo/ui';
import { CheckMark } from '@repo/ui/icons';
import {
  Auth_UpdateUserNameMutation,
  Auth_UpdateUserNameMutationVariables,
  Auth_DeleteAccountMutation,
  Auth_DeleteAccountMutationVariables,
} from '../graphql';
import { useSession } from '../provider/SessionContext';
import { SUPABASE_AUTH } from '../provider/constants';
import { useUserNameExists } from '../hooks/useUserNameExists';

const UPDATE_USER_NAME = gql`
  mutation Auth_UpdateUserName($userName: String!) {
    updateProfile(userName: $userName) {
      userName
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation Auth_DeleteAccount {
    deleteProfile
  }
`;

export const ProfileForm = () => {
  const navigate = useNavigate();
  const { session, profile, logout, changeEmail, refetchProfile } = useSession();
  const sessionEmail = session?.user.email;

  const [email, setEmail] = useState(sessionEmail ?? '');
  const [emailLoading, setEmailLoading] = useState(false);

  const [userName, setUserName] = useState(profile?.userName ?? '');
  const { userNameExists, loading: userNameExistsLoading } = useUserNameExists(userName);

  const [updateUserName, { loading: updateUserNameLoading }] = useMutation<
    Auth_UpdateUserNameMutation,
    Auth_UpdateUserNameMutationVariables
  >(UPDATE_USER_NAME);

  const [deleteAccount, { loading: deleteAccountLoading }] = useMutation<
    Auth_DeleteAccountMutation,
    Auth_DeleteAccountMutationVariables
  >(DELETE_ACCOUNT);

  const isUserNameAvailable = userNameExists === false;
  const isUserNameChanged = userName !== profile?.userName;
  const isEmailChanged = email !== session?.user.email;
  const isEmailConfirmed = Boolean(session?.user.email_confirmed_at) && !isEmailChanged;

  useEffect(() => {
    if (sessionEmail) setEmail(sessionEmail);
  }, [sessionEmail]);

  const handleUpdateUserName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isUserNameChanged) return;

    if (!userName) {
      toast.error('Please enter a username');
      return;
    }
    if (!isUserNameAvailable) {
      toast.error('Username is already taken');
      return;
    }

    try {
      await updateUserName({
        variables: { userName },
        context: { headers: { authorization: session?.access_token } },
      });
      await refetchProfile();
      toast.success('Username updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update username, please try again');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailChanged) return;

    if (!email || !isEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await changeEmail(email);
      // supabase auth will throw an error if the email was already sent
      if (error?.message.includes(SUPABASE_AUTH.ERROR.EMAIL_ALREADY_SENT)) {
        toast.success('Please check both emails for a confirmation link', { duration: 10000 });
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.success('Please check both emails for a confirmation link', { duration: 10000 });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update email, please try again');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({
        context: { headers: { authorization: session?.access_token } },
      });
      toast.success('Account deleted successfully');
      await handleLogout();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete account, please try again');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <h1 className="text-4xl font-bold font-pixel text-center text-muted-foreground">
        Your Profile
      </h1>

      <form onSubmit={handleUpdateUserName}>
        <div className="flex flex-col gap-2">
          <Label className="text-md">Username</Label>
          <div className="flex flex-row items-center gap-4">
            <Input
              name="userName"
              value={userName}
              onChange={({ target }) => setUserName(target.value)}
            />
            <CheckMark
              size={24}
              className={
                !userNameExistsLoading && (isUserNameAvailable || !isUserNameChanged)
                  ? 'text-green-500'
                  : 'text-gray-500'
              }
            />
          </div>

          <Button
            type="submit"
            className="mt-2"
            loading={updateUserNameLoading}
            disabled={!isUserNameChanged || deleteAccountLoading}
          >
            Update Username
          </Button>
        </div>
      </form>

      <form onSubmit={handleUpdateEmail}>
        <div className="flex flex-col gap-2">
          <Label className="text-md">Email</Label>
          <div className="flex flex-row items-center gap-4">
            <Input
              name="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <CheckMark
              size={24}
              className={!emailLoading && isEmailConfirmed ? 'text-green-500' : 'text-gray-500'}
            />
          </div>

          <Button
            type="submit"
            className="mt-2"
            loading={emailLoading}
            disabled={!isEmailChanged || deleteAccountLoading}
          >
            Update Email
          </Button>
        </div>
      </form>

      <div className="w-20 h-[2px] bg-secondary mx-auto" />

      <Button onClick={handleLogout} disabled={deleteAccountLoading} variant="secondary">
        Log Out
      </Button>

      <Button onClick={handleDeleteAccount} loading={deleteAccountLoading} variant="destructive">
        Delete Account
      </Button>
    </div>
  );
};
