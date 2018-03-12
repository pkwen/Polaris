import { Base64 } from "js-base64";

const GitHubAPI = {

  // return {

    pullContent: async (user, repo, path) => {
      const targetFile = `https://api.github.com/repos/${user}/${repo}/contents/${path}`
      const response = await fetch(targetFile);
      const body = await response.json();
      console.log(body);

      if (response.status !== 200) throw Error(body.message);

      return body;
    },

    pushContent: async (targetFile, message, content, sha, token) => {
      const response = await fetch(
        targetFile,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}` //Insert Token here to authenticate pushing
          },
          body: JSON.stringify({
            content: Base64.encode(content),
            message: message,
            sha: sha
          })
        }
      );
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);
      return body;
    },


    fetchToken: async (code) => {
      const tokenURL = `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=2437e80c83661e9e530f&client_secret=b0ae333d9094c5597743cb2fd658cf8b5188aabb&code=${code}`;
      const response = await fetch(
        tokenURL,
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          }
        }
      );
      const body = await response.json();
      return body;
    }
  }
// }

export default GitHubAPI;