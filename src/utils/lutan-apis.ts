import {
  AuthApi,
  CategoriesApi,
  PostWritable,
  PostsApi,
  ThreadsApi,
} from '@/lutan-api';

import { accountModule } from '@/store/modules/account';
import { snackbarsModule } from '@/store/modules/snackbars';

const lutanApis = {
  get baseOptions() {
    return {
      headers: {
        ...(accountModule.getAuthToken
          ? { Authorization: `Token ${accountModule.getAuthToken}` }
          : {}),
      },
    };
  },
  get authApi() {
    return new AuthApi({ baseOptions: this.baseOptions });
  },
  get threadsApi() {
    return new ThreadsApi({ baseOptions: this.baseOptions });
  },
  get postsApi() {
    return new PostsApi({ baseOptions: this.baseOptions });
  },
  get categoriesApi() {
    return new CategoriesApi({ baseOptions: this.baseOptions });
  },
};

export default lutanApis;

export async function deleteThread(threadId: string) {
  try {
    const response = await lutanApis.threadsApi.threadsDelete(threadId);
    if (response.status === 204) {
      snackbarsModule.addSnackbar({
        message: 'Thread was deleted successfully.',
        color: 'success',
      });
    }
  } catch (e) {
    snackbarsModule.addSnackbar({
      message: 'Failed to delete thread. Please try again later.',
      color: 'error',
    });
  }
}

export async function createPost(post: PostWritable) {
  try {
    const response = await lutanApis.postsApi.postsCreate(post);
    if (response.status === 201) {
      snackbarsModule.addSnackbar({
        message: 'Replied successfully',
        color: 'success',
      });
      return 0;
    }
  } catch (error) {
    snackbarsModule.addSnackbar({
      message: 'Failed to reply. Please try again later.',
      color: 'error',
    });
  }
  return 1;
}
