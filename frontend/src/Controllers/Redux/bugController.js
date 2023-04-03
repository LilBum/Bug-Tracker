import bugModel from '../../Models/bugModel';

export async function getAllBugs() {
  try {
    const response = await fetch('/api/bug');
    const data = await response.json();

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
