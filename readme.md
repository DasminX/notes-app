# Notes app task

App has been created for recruitment purposes. It represents simple Notes App, specific kind of Todo App.
_I know it might be overengineered a little bit, but I did it on purpose to show my skills and how I would do it in modular way._

---

## Live demo

I've published this app on gh-pages, so you can freely enter here:
*https://dasminx.github.io/notes-app/*

If you'd like to launch it on your own local machine, no worries! You can do it by following the instruction [here below](#run-it-on-your-own).

---

TODO LIST FOR ME IN APP:

- adding title
- change note MM/DD to more specific
- disabled add/edit button if empty textarea
- add settings class and modal to manage styles, behaviour etc.
- clean types
- htmlBuilder.insertAdjacentHTML to be more declarative (and types to fix!)

---

**It contains such features:**

- Adding new note
- Editing existing note
- Removing existing note
- Exploring notes list
- Filtering existing notes by given text (case insensitive, only for note body, not title)

**It consists of modules:**

1. Composable textarea - takes configuration options and creates independent, resizable textarea component. **Configuration object is in shape of:**

   ```typescript
   Readonly<{
     draggable?: boolean | undefined; // Default true
     placeholder?: string | undefined; // Default "Type your note..."
     addButton?:
       | {
           // Default empty object
           classes?: string[] | undefined; // Default empty array
           text?: string | undefined; // Default "Add"
         }
       | undefined;
     handlers?:
       | {
           // Default empty object
           add?: Function | undefined; // Default empty function
         }
       | undefined;
   }>;
   ```

   It is ready to be injected in any HTML element.

   <br>

2. Entities "Note" and "Time" - I'm not really sure if these are good names for such constructions. I struggled to choose between "entity" and "value object," but neither term fully captures the meaning I intended. Eventually, I decided to use more generic name "entity".

<br>

3. NotesCollection - the class is collecting and manipulating all Notes created by user. Also, it encapsulates it's behaviour. It is taking this responsibilty from main class "Note app".

<br>

4. Notes App - heart of the application, scans for HTML elements present in index.html, binds event listeners, manipulates visibilty of all elements and changes app's state.

## Thoughts

Currently I'm handling **_\_currentEditedNote_** and things related to it in notesApp class, but after considerations I think it may be also a part of NotesCollection. It all depends on the context of handling it. For now I won't change it, but I want to make it clear I'm aware of it can be accomplished another way.

Additionally, there are many possible ways to make this app grow! When it's not more needed in recruitment process, I surely upgrade it!

**Improvements examples:**

- add data persistence with localstorage
- add UI theme changer
- create kind of scheduler and/or reminder for user
- history of notes/tasks
- creating accounts by users
- ... (blank space for more future' thoughts) ...

## Run it on your own!

If you'd like to run this code on your local machine, just follow these steps:

1. Clone the repo

   ```bash
   git clone 'https://github.com/DasminX/notes-app.git' .
   ```

2. Start script

   ```bash
   npm run dev
   ```

3. Visit _http://localhost:5173/_.
   **_NOTE:_** _If it doesn't work, you should check if port is taken and if so, enter a valid port instead._
