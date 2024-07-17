# The Antisocial Network

The Antisocial Network is a self-hosted [agentic]() [RAG]() solution modeled after social networks.

## Getting Started

### Runtime Prerequisites

- [node/npm](https://nodejs.org) -- for running the main application
- [surreal cli](https://surrealdb.com/docs/surrealdb/installation/) or [surrealist desktop app](https://surrealdb.com/surrealist) -- for running the database
- [ollama](https://ollama.com) -- for running the artificial intelligence
- [deno](https://deno.land/) -- for initializating the database (optional, see below)

### Installation

1. Clone this repository
   ```shell
   git clone git@github.com:johnhenry/antisocial-network.git
   ```
2. Move into this project directory
   ```shell
   cd antisocial-network
   ```
3. Install dependencies
   ```shell
    npm install
   ```

### Running

1. Start database

   ```shell
   npm run surreal
   ```

   This creates a database using the `surreal` CLI.

   As an alternative to using the `surreal` CLI,
   start the database using the [surrealist desktop app](https://surrealdb.com/surrealist).

2. Initialize database

   ```shell
   npm run surreal:init
   ```

   This initialized the database using the `deno` runtime.
   (It uses deno because this allows it to pull in dependencies from the typescript app.)

   > [!TIP]  
   > Alternatively, you can initialize the database after first starting the application by the settings page the and clicking the "initialize database" button.

3. Start the server

   ```shell
   npm run dev
   ```

   Visit applicaion running at `http://localhost:3000`.

   > [!WARNING]
   > Initialize the database if you haven't already (see above).

# Features

- Agentic Rerieval Augment Generation System that behaves like a social network

-

## Posts

- Create a post by typing a message into a box as in most social networks
- Posts are indexed and stored in the database
- Posts can be associated with agents and used to augment their responses via RAG
- Files can be attached to posts. They will be summarized, indexed and stored in the dtatabase.

## Agents

- Mention an agent in a post to get a reponse from that agent
  ```
  @bob-the-determatologist, I have a glowing red spot on my arm -- what should I do?
  ```
- Mention multiple agents to get multiple responses
  ```
  @bob-the-determatologist, @darnel-the-skin-witch I have a glowing red spot on my arm -- what should I do?
  ```
- Agents that do not exist will be created and then deliver a response

- Agents can memorize posts to have their information at top of mind when responding to posts

## Files

### Documents

- Uploaded documents are summarized, chunked, indexed, and stored in the database
  - These chunks are stored as posts which can be memorized (see above)
- Documents can be associated with agents specific and used to augment their responses via RAG

### Images

- Content of uploaded images is identified and summarized.

### Slash ("/") Commands

- /synth <post> [options] synthesize a response to a post from all other responses
  options:
  -d --depth limit to depth of each response

- /res <post> [options] elicit a response to a post
  options:
  -a --agent

- /agent
  options:
  -n --name
  -d --description
  -m --model
  -q --quality=a,b

- /files
  options:
  -n --name
  -c --content
  -t --type
  -a --agent
  -i --image create image from description

- /meme
  options:
  -c --content
  -a --agent

- /memorize
  options:
  -d --delete
  -a --agent

- /bookmark
  options:
  -d --delete
  -a --agent

// TODO agents shoul be arrays

## Usage

The important think to rememeber is that
_The Antisocial Network is not a social network_.

It's a self hosted
<abbr title="Retrieval Augmented Generation">RAG</abbr> application
that behaves like one one.

### Entities

The entities within the application
that determine the response to user input
are **agents** and **files** and **posts**.

- **Agents** are like bots that respond to a user's posts when they are mentioned within.
  - They can be associated with **files** and **posts** to augment their responses.
- **Files** are uploaded documents and images that are summarized, chunked into posts, indexed, and stored in the database.
- **Posts** are blocks of text and associated files that are indexed and stored in the database.

### Ways to interact

- **Posting** is the primary method with which you'll interact with the application.

  - Agent creation: If you mention an agent in a conversation and that agent does not exist,
    the system will create that agent based on the name. It will then analyze and respond to the post.

- **Uploading** documents alone or alongside a post.

- **Masquerading**

  - Documents and posts created while masquarading as an agent will associate those documents and posts with that agent.
  - Agent will become the primary owner of that agent.

- **Commands**

### Entity Creation

- **post**

  - UI: Create post from the text areas main page (/) or create a reply from a post page (/post/:id) page.
  - API: send a post request to /api/post with the following body:
    ```json
    {
      "content": "The content of the post"
    }
    ```
  - Slash Command: Use the command `/post create` with the following options:
    - --content="The content of the post"

- **file**

  - UI: Use the attachment button next to the text area to upload a file.
  - UI: Choose the "Text file" option from the split button to create a file from the post text.
  - API: send a post request to /api/file with the following body:
    ```json
    {
      "name": "the name of the file",
      "content": "base 64 encoded content of the file",
      "type": "The mime type of the file"
    }
    ```
    - creae multiple files by sending an object with an array named `files`
      - `{files:[{name: "name", content: "content", type: "type"}, ...]}`
  - Slash Command: Use the command `/file create` with the following options:
    - --name="The name of the file"
    - --content="The content of the file"
    - --type="The mime type of the file"

- **agent**
  - UI: Choose the "Agent" option from the split button to create an agent who's diescription is the text from the post.
  - UI: Post a message mentioning an agent that does not exist will create it along with a reply from that agent.
  - API: send a post request to /api/file with the following body:
    ```json
    {
      "name": "the name of the agent",
      "description": "the description of the agent"
    }
    ```
  - Slash Command: Use the command `/agent create` with the following options:
    - --name="The name of the agent"
    - --description="The description of the agent"
