import { Base64 } from "js-base64";
let token = "";
let user = "";
const baseURL = "https://api.github.com";
const GitHubAPI = {
  //fetch oauth access token using code in url
  fetchToken: async code => {
    const tokenURL = `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=2437e80c83661e9e530f&client_secret=b0ae333d9094c5597743cb2fd658cf8b5188aabb&code=${code}`;
    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json"
      }
    });
    const body = await response.json();
    token = `token ${body.access_token}`;
    GitHubAPI.getUsername(token);
    return body;
  },

  //fetch username
  getUsername: async (token) => {
    let url = `${baseURL}/user`;
    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    user = body.login;
  },

  //recursive method for traversing the tree data structure of repositories
  traverseTree: async (uri, dirname, path) => {
    const response = await fetch(uri, {
      headers: {
        Authorization: token
      }
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    const tree = { name: dirname, path: path };
    if (body.length) {
      tree.children = [];
      for (let i of body) {
        if (i.type === "dir") {
          let child = await GitHubAPI.traverseTree(
            uri.replace(uri.match(/contents\/(.*)/)[1], i.path)
          );
          let dir = { name: i.name, children: child.children, path: i.path };
          tree.children.push(dir);
          // }
        } else {
          tree.children.push({ name: i.name });
        }
      }
    } else {
      return { name: body.name };
    }
    return tree;
  },

  //get list of repos of authenticated user
  populateTree: async (repo, fullName) => {
    const tree = {
      name: repo,
      // toggled: true,
      children: []
    };
    const endpoint = `https://api.github.com/repos/${fullName}/contents/`;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: token
      }
    });
    const body = await response.json();
    if (!body.message) {
      for (let i of body) {
        let url = `https://api.github.com/repos/${fullName}/contents/${
          i.path
          }`;
        let children = await GitHubAPI.traverseTree(url, i.name, i.path);
        tree.children.push(children);
      }
    } else {
      console.log(body.message);
    }
    // tree.children = await GitHubAPI.traverseTree(endpoint);
    console.log(tree);
    return tree;
  },

  //get list of repos and all subdirectories of current user
  syncAll: async token => {
    const data = {
      name: user,
      toggled: true,
      children: []
    };
    const url = `${baseURL}/user/repos`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });
    const body = await response.json();

    for (let i of body) {
      let repo = await GitHubAPI.populateTree(i.name, i.fullName);
      data.children.push(repo);
    }
    return data;
  },

  //open directory/pull file
  accessElement: async (fullName, path) => {
    let url = `${baseURL}/repos/${fullName}/contents/${path}`;
    const children = [];
    const response = await fetch(url, {
      headers: { Authorization: `${token}` }
    });
    const body = await response.json();
    if (body.length) {
      for (let i of body) {
        if (i.type === 'file') {
          children.push({ name: i.name, path: i.path, fullName: fullName })
        } else if (i.type === 'dir') {
          children.push({ name: i.name, path: i.path, children: [], fullName: fullName });
        } else {
          throw new Error('Cannot access unknown element');
        }
      }
    } else {
      children.push(body);
    }
    return children;
  },

  //list all repo names of user
  listRepos: async token => {
    const data = {
      toggled: true,
      children: []
    };
    const url = `${baseURL}/user/repos`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });
    const body = await response.json();
    data.name = user || 'root';

    for (let i of body) {
      data.children.push({ name: i.name, fullName: i.full_name, children: [], path: "" });
    }
    return data;
  },

  //pull content from github file, params: username, repository name, path of file
  pullContent: async (user, repo, path) => {
    const targetFile = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
    const response = await fetch(targetFile);
    const body = await response.json();
    console.log(body);

    if (response.status !== 200) throw Error(body.message);

    return body;
  },

  //push updates to github file, params: api URL, commit message, content, sha, user's github oauth token
  pushContent: async (targetFile, message, content, sha, token) => {
    const response = await fetch(targetFile, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}` //Insert Token here to authenticate pushing
      },
      body: JSON.stringify({
        content: Base64.encode(content),
        message: message,
        sha: sha
      })
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  }
};
// }

export default GitHubAPI;
