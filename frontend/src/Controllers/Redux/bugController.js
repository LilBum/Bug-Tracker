import bugModel from '../../Models/bugModel';
import { request } from '../api';

export async function getAllBugs() {
  try {
    const data = await request('/api/bugs');

    // Convert the response data into bugModel objects
    const bugs = data.map((bug) => new bugModel(bug));

    // Sort the bugs by priority
    bugs.sort((a, b) => a.priority - b.priority);

    return bugs;
  } catch (error) {
    console.error(error);
    return null;
  }
}
