/* data.js - all course content. Edit this file to change or add lessons; app.js never needs to change.
 *
 * Shape:   COURSE_DATA = { course: {...}, modules: [ { id, label, title, lessons: [ { id, no, title, blocks: [...] } ] } ] }
 *
 * Block types (rendered by app.js):
 *   lede        { html }                              intro paragraph
 *   paragraph   { html }
 *   heading     { level: 3|4, html }
 *   list        { ordered, items: [html] }
 *   code        { language: 'c'|'shell', label, code }
 *   table       { head: [html], rows: [[html]] }
 *   figure      { svg, caption }                      inline SVG diagram (or { src, alt, caption } for an image file)
 *   note        { variant: 'note'|'warning'|'story', label, blocks: [...] }
 *   exercise    { label, blocks: [...] }              a task box
 *   hint        { summary, blocks: [...] }            collapsible hint
 *   selfcheck   { items: [{ question, answer }] }     reveal-the-answer questions
 *   checkpoint  { title, items: [html] }              tick-off list; a lesson is complete when all its ticks are set
 *   mcq         { id, question, options: [html], answer: index, explanation }   multiple choice (graded, saved)
 *   quiz        { id, title, questions: [{ question, options, answer, explanation }] }   scored quiz (saved)
 *
 * "html" fields hold inline HTML (code, strong, em, kbd, entities). Keep ids unique and stable: progress is saved by id.
 */
window.COURSE_DATA = {
  course: {
    credit: {
      prefix: "Made by",
      brand: "RevisKor",
      author: "Yahia Shahin"
    },
    title: "Process Calculator Lab",
    eyebrow: "Operating systems · hands-on project",
    description: "You will build a calculator out of Linux processes. Along the way you learn the file system, the shell, <code>fork</code>, <code>exec</code>, <code>waitpid</code> and <code>gcc</code> by using them, not by copying them.",
    storageKey: "process-calculator-lab:v2",
    legacyStorageKey: "process-calculator-lab:v1",
    footer: "Your ticks are saved in this browser only."
  },
  modules: [
    {
      id: "start",
      label: "Start",
      title: "Getting started",
      lessons: [
        {
          id: "overview",
          no: "",
          title: "What you are building",
          blocks: [
            {
              type: "paragraph",
              html: "A program called <code>calculator</code> that behaves like the Python prompt: it shows a prompt, waits for a line, runs it, and asks again."
            },
            {
              type: "code",
              language: "shell",
              label: "the finished program",
              code: String.raw`$ ./calculator
calc> add 2 3
Result: 5
child process exited successfully (PID 4243)
calc> multiply 6
Operation cannot execute: multiply needs 2 argument(s), got 1
calc> add 2 abc
./add: invalid argument
child process exited unsuccessfully with status 1 (PID 4251)
calc> divide 4 2
Operation cannot execute: invalid operator "divide"
calc> exit
$`
            },
            {
              type: "paragraph",
              html: "The interesting part is who does the arithmetic. <code>calculator</code> never adds anything itself. For every valid line it creates a <strong>child process</strong>, and that child turns into one of four tiny programs that do the real work."
            },
            {
              type: "figure",
              svg: "<svg aria-label=\"calculator is the parent process; it starts add, sub, multiply or negate as a child process\" role=\"img\" viewbox=\"0 0 760 262\">\n<defs><marker id=\"ah1\" markerheight=\"7\" markerwidth=\"7\" orient=\"auto-start-reverse\" refx=\"9\" refy=\"5\" viewbox=\"0 0 10 10\"><path d=\"M0 0L10 5L0 10z\" fill=\"var(--muted)\"></path></marker></defs>\n<rect class=\"sv-box\" height=\"68\" rx=\"8\" width=\"132\" x=\"14\" y=\"97\"></rect>\n<text class=\"sv-t\" text-anchor=\"middle\" x=\"80\" y=\"126\">You</text>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"80\" y=\"146\">type a line</text>\n<path class=\"sv-line\" d=\"M146 131H208\" marker-end=\"url(#ah1)\"></path>\n<rect class=\"sv-box hi\" height=\"182\" rx=\"8\" width=\"220\" x=\"210\" y=\"40\"></rect>\n<text class=\"sv-h\" x=\"226\" y=\"66\">Parent process</text>\n<text class=\"sv-t\" x=\"226\" y=\"90\">calculator.c</text>\n<text class=\"sv-s\" x=\"226\" y=\"118\">shows the calc&gt; prompt</text>\n<text class=\"sv-s\" x=\"226\" y=\"138\">checks the operator name</text>\n<text class=\"sv-s\" x=\"226\" y=\"158\">checks the argument count</text>\n<text class=\"sv-s\" x=\"226\" y=\"186\">then: fork, exec, waitpid</text>\n<text class=\"sv-s\" x=\"226\" y=\"206\">and reports the exit status</text>\n<path class=\"sv-line\" d=\"M430 131H488\"></path>\n<path class=\"sv-line\" d=\"M488 131V40M488 131V222\"></path>\n<path class=\"sv-line\" d=\"M488 40H520\" marker-end=\"url(#ah1)\"></path>\n<path class=\"sv-line\" d=\"M488 94H520\" marker-end=\"url(#ah1)\"></path>\n<path class=\"sv-line\" d=\"M488 168H520\" marker-end=\"url(#ah1)\"></path>\n<path class=\"sv-line\" d=\"M488 222H520\" marker-end=\"url(#ah1)\"></path>\n<rect class=\"sv-box\" height=\"40\" rx=\"8\" width=\"224\" x=\"522\" y=\"20\"></rect><text class=\"sv-m\" x=\"538\" y=\"45\">add A B</text>\n<rect class=\"sv-box\" height=\"40\" rx=\"8\" width=\"224\" x=\"522\" y=\"74\"></rect><text class=\"sv-m\" x=\"538\" y=\"99\">sub A B</text>\n<rect class=\"sv-box\" height=\"40\" rx=\"8\" width=\"224\" x=\"522\" y=\"148\"></rect><text class=\"sv-m\" x=\"538\" y=\"173\">multiply A B</text>\n<rect class=\"sv-box\" height=\"40\" rx=\"8\" width=\"224\" x=\"522\" y=\"202\"></rect><text class=\"sv-m\" x=\"538\" y=\"227\">negate A</text>\n<text class=\"sv-h\" x=\"522\" y=\"12\">Child processes</text>\n</svg>",
              caption: "One parent, four possible children. The child prints the result itself and ends; the parent reads how it ended."
            },
            {
              type: "heading",
              level: 3,
              html: "The five files"
            },
            {
              type: "table",
              head: ["File", "Role", "Arguments it needs"],
              rows: [
                [
                  "<code>calculator.c</code>",
                  "The parent: prompt, checks, fork, exec, wait, report",
                  "none (it reads lines)"
                ],
                ["<code>add.c</code>", "Prints A + B", "2"],
                ["<code>sub.c</code>", "Prints A − B", "2"],
                ["<code>multiply.c</code>", "Prints A × B", "2"],
                ["<code>negate.c</code>", "Prints −A", "1"]
              ]
            },
            {
              type: "note",
              variant: "story",
              label: "In the kitchen story",
              blocks: [
                {
                  type: "paragraph",
                  html: "The calculator is a head cook who never cooks. Each order, they clone themselves, the clone swaps its recipe for the right one (<code>add</code>, <code>sub</code> …), cooks, and reports back with a thumbs-up or a thumbs-down. The head cook waits for that report before taking the next order."
                }
              ]
            }
          ]
        },
        {
          id: "how",
          no: "",
          title: "How to use this guide",
          blocks: [
            {
              type: "list",
              ordered: true,
              items: [
                "<strong>Type everything.</strong> There are no copy buttons on purpose. Typing is how the syntax gets into your hands, and the compiler will tell you when you slip.",
                "<strong>Predict, then run.</strong> Before you run something, say out loud what you expect. A wrong prediction is the best moment of learning.",
                "<strong>Open the manual first.</strong> When a command or function is new, run <code>man</code> on it before reading my explanation. Phase 1 teaches you how.",
                "<strong>Open hints one at a time.</strong> They get more revealing from the first to the last. Stop as soon as you can continue.",
                "<strong>Tick the checkpoints honestly.</strong> Your ticks are saved in this browser, so you can close the page and come back."
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "Before you start",
              blocks: [
                {
                  type: "paragraph",
                  html: "You need a Linux terminal: a Linux machine, WSL on Windows, or a Linux virtual machine. Check that the compiler is installed:"
                },
                {
                  type: "code",
                  language: "shell",
                  label: "terminal",
                  code: String.raw`$ gcc --version`
                },
                {
                  type: "paragraph",
                  html: "If it is missing, install it with your package manager (on Ubuntu or Debian: <code>sudo apt install build-essential</code>). For the manual pages of C functions, which Phase 3 uses a lot, also install <code>man-db</code> and <code>manpages-dev</code>."
                }
              ]
            },
            {
              type: "note",
              variant: "warning",
              label: "When you get stuck",
              blocks: [
                {
                  type: "paragraph",
                  html: "Try the hints, then the manual, then ask for help. When you ask a person or an AI, include four things: the exact command you ran, the <em>complete</em> output, your code, and what you expected instead. That is what makes the answer useful."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p1",
      label: "Phase 1",
      title: "Find your way around",
      lessons: [
        {
          id: "p1-intro",
          no: "",
          title: "Overview",
          blocks: [
            {
              type: "lede",
              html: "By the end you can move through the Linux file system without getting lost, create folders and files, read the manual, and you will have set up the folder that holds the whole project."
            }
          ]
        },
        {
          id: "s1-1",
          no: "1.1",
          title: "How files and folders work",
          blocks: [
            {
              type: "lede",
              html: "Before any command, you need a picture of what the commands act on. Every command in this phase is a way to look at this picture or change it."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "A <strong>file</strong> is a named piece of data: text, a program, a picture. Your <code>calculator.c</code> and the compiled program <code>calculator</code> are both files.",
                "A <strong>directory</strong> is a folder. Technically it is a special file whose job is to hold a list of other files and directories. “Directory” and “folder” mean the same thing; Linux documentation says directory.",
                "Everything lives in <strong>one tree</strong> that starts at a single top directory called the <strong>root</strong>, written <code>/</code>. There are no drive letters like <code>C:</code>."
              ]
            },
            {
              type: "figure",
              svg: "<svg aria-label=\"The Linux file system is a tree starting at the root directory\" role=\"img\" viewbox=\"0 0 760 340\">\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"70\" x=\"345\" y=\"12\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"380\" y=\"34\">/</text>\n<path class=\"sv-line\" d=\"M380 46V70H200V96\"></path><path class=\"sv-line\" d=\"M380 46V70H420V96\"></path><path class=\"sv-line\" d=\"M380 46V70H560V96\"></path><path class=\"sv-line\" d=\"M380 46V70H680V96\"></path>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"90\" x=\"155\" y=\"96\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"200\" y=\"118\">home</text>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"90\" x=\"375\" y=\"96\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"420\" y=\"118\">usr</text>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"90\" x=\"515\" y=\"96\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"560\" y=\"118\">etc</text>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"90\" x=\"635\" y=\"96\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"680\" y=\"118\">tmp</text>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"560\" y=\"152\">system settings</text>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"680\" y=\"152\">temporary files</text>\n<path class=\"sv-line\" d=\"M200 130V170\"></path>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"90\" x=\"155\" y=\"170\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"200\" y=\"192\">you</text>\n<text class=\"sv-a\" x=\"258\" y=\"192\">~ = your home</text>\n<path class=\"sv-line\" d=\"M200 204V244\"></path>\n<rect class=\"sv-box hi dash\" height=\"34\" rx=\"8\" width=\"150\" x=\"125\" y=\"244\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"200\" y=\"266\">calc_project</text>\n<path class=\"sv-line\" d=\"M200 278V292\"></path>\n<text class=\"sv-m\" font-size=\"12\" x=\"40\" y=\"312\">calculator.c add.c sub.c multiply.c negate.c</text>\n<path class=\"sv-line\" d=\"M420 130V170\"></path>\n<rect class=\"sv-box\" height=\"34\" rx=\"8\" width=\"70\" x=\"385\" y=\"170\"></rect><text class=\"sv-m\" text-anchor=\"middle\" x=\"420\" y=\"192\">bin</text>\n<path class=\"sv-line\" d=\"M420 204V220\"></path>\n<text class=\"sv-m\" font-size=\"12\" text-anchor=\"middle\" x=\"420\" y=\"238\">ls   gcc   man</text>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"420\" y=\"258\">programs are files too</text>\n<text class=\"sv-s\" x=\"40\" y=\"332\">Dashed box: the folder you will create in step 1.6. Your own username replaces “you”.</text>\n</svg>",
              caption: "Part of a typical Linux tree. Every file has exactly one place in it."
            },
            {
              type: "heading",
              level: 4,
              html: "Paths: addresses in the tree"
            },
            {
              type: "paragraph",
              html: "A <strong>path</strong> names a file by listing the directories to pass through, separated by <code>/</code>."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "An <strong>absolute path</strong> starts with <code>/</code> and works from anywhere: <code>/home/you/calc_project/add.c</code>.",
                "A <strong>relative path</strong> does not start with <code>/</code> and begins from where you currently are: <code>calc_project/add.c</code>."
              ]
            },
            {
              type: "paragraph",
              html: "“Where you currently are” is the <strong>working directory</strong>. Every process has one, including your shell. Remember that: in Phase 3 your child processes will inherit theirs, which is why <code>./add</code> will be found."
            },
            {
              type: "heading",
              level: 4,
              html: "Four shortcuts and two rules"
            },
            {
              type: "table",
              head: ["Name", "Means"],
              rows: [
                ["<code>.</code>", "The current directory"],
                ["<code>..</code>", "The parent: the directory one level up"],
                ["<code>~</code>", "Your home directory, <code>/home/you</code>"],
                [
                  "<code>-</code>",
                  "The previous directory (only meaningful to <code>cd</code>)"
                ]
              ]
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Names that start with a dot (<code>.bashrc</code>) are <strong>hidden</strong> from a plain listing.",
                "Names are <strong>case-sensitive</strong>: <code>Add.c</code> and <code>add.c</code> are different files. Avoid spaces in names; they need quoting everywhere."
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Is <code>lab/notes.txt</code> an absolute or a relative path?",
                  answer: "Relative. It does not start with <code>/</code>, so it is read from your working directory."
                },
                {
                  question: "You are in <code>/home/you/lab</code>. What is <code>..</code>?",
                  answer: "<code>/home/you</code>, the parent directory."
                },
                {
                  question: "Why can two different users each have a file called <code>notes.txt</code> without clashing?",
                  answer: "Their files live in different directories (<code>/home/alice/notes.txt</code> and <code>/home/bob/notes.txt</code>). The full path is what identifies a file, not just its name."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can explain, in my own words, what a directory is.",
                "I can tell an absolute path from a relative path.",
                "I know what <code>.</code>, <code>..</code> and <code>~</code> stand for."
              ]
            }
          ]
        },
        {
          id: "s1-2",
          no: "1.2",
          title: "Where am I, and what is here?",
          blocks: [
            {
              type: "paragraph",
              html: "Two commands answer the two questions you will ask most often. <code>pwd</code> prints the <strong>working directory</strong>. <code>ls</code> <strong>lists</strong> the contents of a directory."
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "paragraph",
                  html: "Open a terminal and run these one at a time. <strong>Predict the output before you press Enter.</strong>"
                },
                {
                  type: "code",
                  language: "shell",
                  label: "terminal",
                  code: String.raw`$ pwd
$ ls
$ ls -l
$ ls -a
$ ls -la`
                },
                {
                  type: "paragraph",
                  html: "Which entries appear only with <code>-a</code>? What do their names have in common?"
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Flags change what a command does"
            },
            {
              type: "paragraph",
              html: "The <code>-l</code> and <code>-a</code> above are <strong>flags</strong> (also called options). Short flags are one dash and one letter, and they can be combined: <code>-la</code> means <code>-l -a</code>. Order within the group rarely matters."
            },
            {
              type: "paragraph",
              html: "Here is what <code>ls -l</code> prints and how to read each line:"
            },
            {
              type: "code",
              language: "shell",
              label: "example output",
              code: String.raw`$ ls -l
-rw-r--r-- 1 you you  120 Nov 18 08:05 notes.txt
drwxr-xr-x 2 you you 4096 Nov 18 08:04 lab`
            },
            {
              type: "table",
              head: ["Part", "Meaning"],
              rows: [
                [
                  "<code>-</code> or <code>d</code>",
                  "First character: <code>-</code> is a regular file, <code>d</code> is a directory"
                ],
                [
                  "<code>rw-r--r--</code>",
                  "Permissions as three groups of <code>rwx</code> (read, write, execute): owner, group, everyone else"
                ],
                ["<code>you you</code>", "Owner and group"],
                ["<code>120</code>", "Size in bytes"],
                ["<code>Nov 18 08:05</code>", "When it was last modified"],
                ["<code>notes.txt</code>", "The name"]
              ]
            },
            {
              type: "exercise",
              label: "Task: look it up",
              blocks: [
                {
                  type: "paragraph",
                  html: "Do not search the web. Open <code>man ls</code> (step 1.5 shows how to move around in it) and find the flags that:"
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "print sizes as <code>4.0K</code> or <code>2.1M</code> instead of raw bytes,",
                    "sort the listing by modification time, newest first,",
                    "sort the listing by size, largest first."
                  ]
                },
                {
                  type: "paragraph",
                  html: "Then combine two of them in one command."
                },
                {
                  type: "hint",
                  summary: "Hint: where in the page?",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Search inside the manual with <kbd>/</kbd> followed by a word, for example <code>/human</code>. Press <kbd>n</kbd> for the next match."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Answer",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>-h</code> (human-readable, used with <code>-l</code>), <code>-t</code> (time), <code>-S</code> (size). For example <code>ls -lhS</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can read an <code>ls -l</code> line: type, permissions, size, date, name.",
                "I found the <code>-h</code>, <code>-t</code> and <code>-S</code> flags in the manual myself."
              ]
            }
          ]
        },
        {
          id: "s1-3",
          no: "1.3",
          title: "Moving around",
          blocks: [
            {
              type: "paragraph",
              html: "<code>cd</code> (change directory) moves your working directory. It takes a path, absolute or relative."
            },
            {
              type: "table",
              head: ["You type", "You go to"],
              rows: [
                ["<code>cd /usr/bin</code>", "That exact place (absolute path)"],
                [
                  "<code>cd lab</code>",
                  "The <code>lab</code> directory inside where you are (relative path)"
                ],
                ["<code>cd ..</code>", "One level up"],
                ["<code>cd ~</code> or just <code>cd</code>", "Your home directory"],
                ["<code>cd -</code>", "Wherever you were before the last <code>cd</code>"]
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "Two habits that save hours",
              blocks: [
                {
                  type: "paragraph",
                  html: "Press <kbd>Tab</kbd> after typing the first letters of a name and the shell completes it (press it twice to see the options). Press <kbd>↑</kbd> to bring back earlier commands."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Run <code>cd /usr/bin</code>, then <code>pwd</code>.",
                    "You are in <code>/usr/bin</code>. <strong>Predict</strong> where <code>cd ../lib</code> takes you, then run it and check with <code>pwd</code>.",
                    "Run <code>cd</code> with no argument, then <code>pwd</code>. Where are you?",
                    "Run <code>cd -</code>. Where are you now?",
                    "Run <code>which gcc</code>, then <code>ls -l</code> on the path it prints. A compiler is just a file in a directory too."
                  ]
                },
                {
                  type: "hint",
                  summary: "Check your predictions",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Step 2 lands in <code>/usr/lib</code>: <code>..</code> climbs from <code>/usr/bin</code> to <code>/usr</code>, then <code>lib</code> descends. Step 3 returns you to your home directory. Step 4 returns you to <code>/usr/lib</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can get to any directory using both absolute and relative paths.",
                "I check <code>pwd</code> when I am unsure where I am.",
                "I use <kbd>Tab</kbd> completion."
              ]
            }
          ]
        },
        {
          id: "s1-4",
          no: "1.4",
          title: "Make, view, copy, move, delete",
          blocks: [
            {
              type: "table",
              head: ["Command", "What it does", "Example"],
              rows: [
                ["<code>mkdir</code>", "Make a directory", "<code>mkdir lab</code>"],
                [
                  "<code>touch</code>",
                  "Create an empty file (or refresh the date of an existing one)",
                  "<code>touch a.c b.c</code>"
                ],
                [
                  "<code>echo</code> and <code>&gt;</code>",
                  "<code>echo</code> prints text; <code>&gt;</code> sends that output into a file instead, replacing the file",
                  "<code>echo hi &gt; notes.txt</code>"
                ],
                ["<code>cat</code>", "Print a file's contents", "<code>cat notes.txt</code>"],
                [
                  "<code>cp</code>",
                  "Copy a file (add <code>-r</code> for a directory)",
                  "<code>cp a.c backup.c</code>"
                ],
                [
                  "<code>mv</code>",
                  "Move <em>or rename</em> (same operation)",
                  "<code>mv backup.c old.c</code>"
                ],
                [
                  "<code>rm</code>",
                  "Delete a file (add <code>-r</code> for a directory and everything inside)",
                  "<code>rm old.c</code>"
                ],
                [
                  "<code>file</code>",
                  "Tell you what kind of file something is",
                  "<code>file /bin/ls</code>"
                ]
              ]
            },
            {
              type: "note",
              variant: "warning",
              label: "rm has no recycle bin",
              blocks: [
                {
                  type: "paragraph",
                  html: "Deleted means gone. Before any <code>rm -r</code>, run <code>pwd</code> and <code>ls</code> and read what you are about to remove. Never run <code>rm -r</code> on <code>/</code>, on <code>~</code>, or on a name you did not type yourself."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: practice in a scratch folder",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "In your home directory, make a folder called <code>scratch</code> and go into it.",
                    "Create the nested folders <code>a/b/c</code> with <strong>one</strong> command.",
                    "Create <code>notes.txt</code> containing the text <code>hello linux</code> using <code>echo</code> and <code>&gt;</code>. Show it with <code>cat</code>.",
                    "Copy <code>notes.txt</code> to <code>copy.txt</code>, then rename <code>copy.txt</code> to <code>renamed.txt</code>. Check with <code>ls -l</code>.",
                    "Run <code>file notes.txt</code> and <code>file /bin/ls</code>. How do the two answers differ?",
                    "Go back to your home directory and delete <code>scratch</code> with one command. Confirm it is gone."
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 2",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Plain <code>mkdir a/b/c</code> fails because <code>a</code> does not exist yet. Find the flag in <code>man mkdir</code> that creates parent directories as needed."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 6",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "You cannot delete the directory you are standing in. Leave it first with <code>cd ..</code>, then use <code>rm</code> with the flag for directories."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I completed all six scratch steps, and found the <code>mkdir</code> flag in the manual.",
                "I know <code>mv</code> both moves and renames, and that <code>rm</code> cannot be undone."
              ]
            }
          ]
        },
        {
          id: "s1-5",
          no: "1.5",
          title: "Meet the manual",
          blocks: [
            {
              type: "lede",
              html: "Every command and every C function you will use has a manual page on your machine. Reading them is the most valuable skill in this whole guide, because it works for commands nobody has written a tutorial for."
            },
            {
              type: "heading",
              level: 4,
              html: "Moving around in a man page"
            },
            {
              type: "paragraph",
              html: "A man page opens in a pager, a program that shows one screen at a time."
            },
            {
              type: "table",
              head: ["Key", "Does"],
              rows: [
                ["<kbd>Space</kbd> / <kbd>b</kbd>", "Next screen / previous screen"],
                [
                  "<kbd>j</kbd> or <kbd>↓</kbd>, <kbd>k</kbd> or <kbd>↑</kbd>",
                  "One line down / up"
                ],
                ["<kbd>/</kbd> then a word, <kbd>Enter</kbd>", "Search forward"],
                ["<kbd>n</kbd> / <kbd>N</kbd>", "Next match / previous match"],
                ["<kbd>g</kbd> / <kbd>G</kbd>", "Jump to the top / the bottom"],
                ["<kbd>q</kbd>", "Quit"]
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The parts of a page"
            },
            {
              type: "paragraph",
              html: "Most pages share the same headings. You rarely read all of it. You scan for the part you need."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<strong>NAME</strong>: one line saying what it is.",
                "<strong>SYNOPSIS</strong>: the shape of a correct call. Read it first.",
                "<strong>DESCRIPTION</strong> and <strong>OPTIONS</strong>: what it does and what each flag changes.",
                "<strong>RETURN VALUE</strong> or <strong>EXIT STATUS</strong>: what comes back, and how failure is reported.",
                "<strong>SEE ALSO</strong>: related pages. A fast way to discover the function you actually need."
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Reading a SYNOPSIS"
            },
            {
              type: "paragraph",
              html: "Square brackets <code>[ ]</code> mean optional, <code>...</code> means “can repeat”, <code>|</code> means “or”, and CAPITAL words are placeholders for something you supply."
            },
            {
              type: "code",
              language: "shell",
              label: "from man ls and man cp",
              code: String.raw`ls [OPTION]... [FILE]...
cp [OPTION]... SOURCE... DEST`
            },
            {
              type: "paragraph",
              html: "So <code>ls</code> works with no options and no file, and <code>cp</code> needs at least one source and a destination. For C functions the SYNOPSIS is real C, and its first line tells you something you will need in Phase 3:"
            },
            {
              type: "code",
              language: "shell",
              label: "from man 3 strtol",
              code: String.raw`SYNOPSIS
       #include <stdlib.h>

       long strtol(const char *nptr, char **endptr, int base);`
            },
            {
              type: "note",
              variant: "note",
              label: "Rule for C",
              blocks: [
                {
                  type: "paragraph",
                  html: "The <code>#include</code> line in a function's SYNOPSIS is the header you must include to use it. That is how you find “the correct headers” without guessing."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Sections and finding the right page"
            },
            {
              type: "paragraph",
              html: "Manual pages are grouped into numbered sections, and the same name can exist in several."
            },
            {
              type: "table",
              head: ["Section", "Holds", "Example"],
              rows: [
                ["1", "Commands you type", "<code>man 1 printf</code>"],
                ["2", "System calls (the kernel's window)", "<code>man 2 fork</code>"],
                ["3", "C library functions", "<code>man 3 printf</code>"],
                ["7", "Overviews and concepts", "<code>man 7 signal</code>"]
              ]
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<code>man -k word</code> searches page names and descriptions when you do not know the exact name.",
                "<code>command --help</code> prints a short usage summary, often enough for a quick reminder.",
                "<code>man man</code> explains the manual itself."
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "If man says “No manual entry”",
              blocks: [
                {
                  type: "paragraph",
                  html: "Minimal systems and some WSL images do not ship the pages. On Ubuntu or Debian: <code>sudo apt install man-db manpages-dev</code>. The <code>manpages-dev</code> package holds sections 2 and 3."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: five lookups",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Which flag makes <code>cp</code> ask before overwriting a file?",
                    "What does <code>mkdir -p</code> do?",
                    "Open <code>man 2 fork</code>. What does the NAME line say?",
                    "Open <code>man 3 strtol</code>. Which header does the SYNOPSIS tell you to include?",
                    "Open <code>man bash</code>, search for <code>Special Parameters</code>, and find which parameter holds the exit status of the last command."
                  ]
                },
                {
                  type: "hint",
                  summary: "Answers (after you tried)",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "1: <code>-i</code>. 2: creates missing parent directories and does not complain if the directory exists. 3: <code>fork - create a child process</code>. 4: <code>&lt;stdlib.h&gt;</code>. 5: <code>?</code>, used as <code>$?</code>. You will use it in Phase 4."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can open a man page, search inside it, and quit.",
                "I can read a SYNOPSIS, including which header a C function needs.",
                "I know <code>man 2</code> and <code>man 3</code> are different from <code>man 1</code>."
              ]
            }
          ]
        },
        {
          id: "s1-6",
          no: "1.6",
          title: "Set up the project folder",
          blocks: [
            {
              type: "paragraph",
              html: "Now apply it to the real thing. You will make the folder that holds the whole project and create the five empty source files."
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Go to your home directory and confirm with <code>pwd</code>.",
                    "Create a directory called <code>calc_project</code> and move into it.",
                    "Create five empty files: <code>calculator.c</code>, <code>add.c</code>, <code>sub.c</code>, <code>multiply.c</code>, <code>negate.c</code>.",
                    "List the directory with details. All five should exist and have size 0.",
                    "Leave the folder with a relative path, then return with a relative path. Leave again and return with an absolute path using <code>~</code>."
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 3",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>touch</code> accepts several names at once, so one command is enough."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 5",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Relative out: <code>cd ..</code>. Relative back: <code>cd calc_project</code>. Absolute back: <code>cd ~/calc_project</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "paragraph",
              html: "When it worked, <code>ls</code> shows your files in alphabetical order:"
            },
            {
              type: "code",
              language: "shell",
              label: "expected",
              code: String.raw`$ ls
add.c  calculator.c  multiply.c  negate.c  sub.c`
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "You are in <code>~/calc_project</code>. What does <code>ls ..</code> list?",
                  answer: "The contents of your home directory, because <code>..</code> is the parent of the working directory."
                },
                {
                  question: "What is the difference between <code>cd calc_project</code> and <code>cd /calc_project</code>?",
                  answer: "The first is relative and looks inside the current directory. The second is absolute and looks for a <code>calc_project</code> directly under the root, which probably does not exist."
                },
                {
                  question: "How would you rename <code>sub.c</code> to <code>subtract.c</code>?",
                  answer: "<code>mv sub.c subtract.c</code>. Renaming is a move within the same directory."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Phase 1 checkpoint",
              items: [
                "<code>~/calc_project</code> exists with the five empty files.",
                "I can navigate with absolute and relative paths and I know where I am at all times.",
                "I looked things up in the manual instead of guessing."
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p2",
      label: "Phase 2",
      title: "Fork, wait and exec",
      lessons: [
        {
          id: "p2-intro",
          no: "",
          title: "Overview",
          blocks: [
            {
              type: "lede",
              html: "The calculator is a parent that creates children. Here you learn the three system calls behind that, by running small programs and watching what they do."
            },
            {
              type: "note",
              variant: "note",
              label: "Set up a place to work",
              blocks: [
                {
                  type: "paragraph",
                  html: "Keep these experiments out of the project folder. Make a directory called <code>demos</code> in your home directory and work inside it. Use any editor: <code>nano fork1.c</code> in the terminal (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Enter</kbd> to save, <kbd>Ctrl</kbd>+<kbd>X</kbd> to leave), or VS Code."
                },
                {
                  type: "paragraph",
                  html: "To build and run a demo you only need this. Phase 4 explains the compiler properly."
                },
                {
                  type: "code",
                  language: "shell",
                  label: "terminal",
                  code: String.raw`$ gcc fork1.c -o fork1
$ ./fork1`
                }
              ]
            }
          ]
        },
        {
          id: "s2-1",
          no: "2.1",
          title: "What is a process?",
          blocks: [
            {
              type: "paragraph",
              html: "A <strong>program</strong> is a file on disk: instructions waiting to be used. A <strong>process</strong> is that program <em>running</em>: loaded into memory, with its own variables, its own place in the code, and its own number. Run one program twice and you have two processes."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Every process has a <strong>PID</strong>, a process ID, unique among the processes running right now.",
                "Every process except the first was started by another one. That one is its <strong>parent</strong>, and its number is the <strong>PPID</strong>.",
                "Your shell is the parent of every command you type. That is the relationship the calculator will copy."
              ]
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "code",
                  language: "shell",
                  label: "terminal",
                  code: String.raw`$ echo $$
$ ps -o pid,ppid,comm
$ pstree -p $$
$ sleep 60 &
$ ps -o pid,ppid,comm`
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<code>$$</code> is the PID of your shell. Find that number in the <code>ps</code> output. What is the PPID of the <code>ps</code> process itself?",
                    "After <code>sleep 60 &amp;</code> (the <code>&amp;</code> runs it in the background), which process is <code>sleep</code>'s parent?",
                    "Look up the <code>-o</code> flag in <code>man ps</code> and add one more column of your choice.",
                    "Stop the sleep with <code>kill</code> followed by its PID."
                  ]
                },
                {
                  type: "hint",
                  summary: "Check",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>ps</code> and <code>sleep</code> both have your shell's PID as their PPID, because the shell created them."
                    }
                  ]
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "What is the difference between a program and a process?",
                  answer: "A program is a file. A process is a running instance of it, with its own PID and memory. One program can be many processes."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can find a process's PID and PPID with <code>ps</code>.",
                "I understand the shell is the parent of the commands I run."
              ]
            }
          ]
        },
        {
          id: "s2-2",
          no: "2.2",
          title: "fork: making a child",
          blocks: [
            {
              type: "paragraph",
              html: "<code>fork()</code> creates a new process that is an almost exact copy of the one that called it: same code, same variables with the same values, same position in the program. The two differ in two ways: their PIDs, and what <code>fork()</code> returned to each."
            },
            {
              type: "figure",
              svg: "<svg aria-label=\"fork splits one process into a parent and a child\" role=\"img\" viewbox=\"0 0 760 170\">\n<text class=\"sv-s\" x=\"40\" y=\"52\">one process</text>\n<path class=\"sv-line\" d=\"M40 72H300\"></path>\n<path class=\"sv-line\" d=\"M300 72H720\"></path>\n<path class=\"sv-line\" d=\"M300 72C335 72 320 138 365 138H720\"></path>\n<circle cx=\"300\" cy=\"72\" fill=\"var(--accent)\" r=\"5\"></circle>\n<text class=\"sv-a\" text-anchor=\"middle\" x=\"300\" y=\"48\">fork()</text>\n<text class=\"sv-t\" text-anchor=\"end\" x=\"720\" y=\"60\">parent: fork returned the child's PID (a positive number)</text>\n<text class=\"sv-t\" text-anchor=\"end\" x=\"720\" y=\"126\">child: fork returned 0</text>\n<text class=\"sv-s\" text-anchor=\"end\" x=\"720\" y=\"94\">both keep running the next line of code</text>\n</svg>",
              caption: "One call, two returns. That is how each copy tells which one it is."
            },
            {
              type: "table",
              head: ["fork() returned", "Meaning"],
              rows: [
                [
                  "a positive number",
                  "You are the <strong>parent</strong>; the number is the child's PID"
                ],
                ["<code>0</code>", "You are the <strong>child</strong>"],
                [
                  "<code>-1</code>",
                  "It failed; no child exists (check <code>errno</code>, print with <code>perror</code>)"
                ]
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Why copy first?"
            },
            {
              type: "paragraph",
              html: "The calculator must still be there to show the next prompt after every calculation. Starting another program (<code>exec</code>, step 2.4) <em>replaces</em> the process that calls it. If the calculator did that itself, it would vanish. So it first makes a copy of itself and lets the copy be replaced."
            },
            {
              type: "exercise",
              label: "Task: type, predict, run",
              blocks: [
                {
                  type: "code",
                  language: "c",
                  label: "fork1.c",
                  code: String.raw`#include <stdio.h>
#include <unistd.h>

int main(void) {
    int x = 10;
    printf("before fork: PID %d\n", getpid());
    pid_t pid = fork();
    if (pid == 0) {
        x = 99;
        printf("child:  PID %d, parent %d, x = %d\n", getpid(), getppid(), x);
    } else if (pid > 0) {
        printf("parent: PID %d, child %d, x = %d\n", getpid(), pid, x);
    } else {
        perror("fork");
        return 1;
    }
    return 0;
}`
                },
                {
                  type: "paragraph",
                  html: "Before you run it, answer: how many “before fork” lines appear, and what is <code>x</code> in each process? Then run it several times."
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Is the order of the parent and child lines always the same?",
                    "The child set <code>x = 99</code>. Why does the parent still print 10?",
                    "Sometimes the child's “parent” PID is not the parent's PID. Why might that be? (The next step fixes it.)",
                    "Run <code>./fork1 | cat</code>. Count the “before fork” lines. If you see something surprising, think about <em>when</em> <code>printf</code> actually sends text out."
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint 1: ordering and PPID",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "After <code>fork</code>, the kernel decides who runs first. Nothing guarantees an order. If the parent finishes before the child prints, the child has been adopted by another process, so <code>getppid()</code> returns a different number."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint 2: variables",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "The child gets a <em>copy</em> of the parent's memory. Changing the copy does not change the original."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint 3: the doubled line",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "On a terminal, <code>printf</code> sends a line out when it sees <code>\\n</code>. Into a pipe or a file, it keeps text in a buffer until the buffer fills or the program ends. <code>fork</code> copies that unsent buffer too, so both processes eventually send “before fork”. The cure is to call <code>fflush(stdout)</code> before <code>fork()</code>. You will do exactly that in the calculator."
                    }
                  ]
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "What does <code>fork()</code> return in the child?",
                  answer: "<code>0</code>. In the parent it returns the child's PID."
                },
                {
                  question: "The parent changes a variable after fork. Does the child see the change?",
                  answer: "No. After <code>fork</code> the two processes have separate copies of memory."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "<code>fork1</code> compiles and runs, and I can explain each output line.",
                "I can explain why <code>fork</code> returns twice.",
                "I saw the buffering effect with <code>| cat</code> and know why <code>fflush(stdout)</code> goes before <code>fork()</code>."
              ]
            }
          ]
        },
        {
          id: "s2-3",
          no: "2.3",
          title: "waitpid: waiting for the child",
          blocks: [
            {
              type: "paragraph",
              html: "A parent that does not wait has three problems: it cannot know when the child is done, it cannot learn <em>how</em> it ended, and a finished child lingers in the process list as a <strong>zombie</strong> until someone collects its result. For the calculator there is a fourth: the next <code>calc&gt;</code> prompt would appear before the child's answer."
            },
            {
              type: "paragraph",
              html: "<code>waitpid(pid, &amp;status, 0)</code> pauses the parent until the child <code>pid</code> ends, and stores how it ended in <code>status</code>. That number is encoded, so you read it with macros instead of printing it."
            },
            {
              type: "exercise",
              label: "Task: look it up first",
              blocks: [
                {
                  type: "paragraph",
                  html: "Open <code>man 2 waitpid</code>. Search for <code>WIFEXITED</code> and <code>WEXITSTATUS</code>. In your own words: what does each one tell you? Also note which headers the SYNOPSIS needs."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: type, predict, run",
              blocks: [
                {
                  type: "code",
                  language: "c",
                  label: "fork2.c",
                  code: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }
    if (pid == 0) {
        printf("child: working...\n");
        sleep(2);
        exit(3);
    }
    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) {
        printf("parent: child %d exited with status %d\n", pid, WEXITSTATUS(status));
    }
    return 0;
}`
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "What does the parent print, and when? Run it and time it with your eyes.",
                    "Run <code>./fork2; echo $?</code>. The child exited with 3. Why does the shell report 0?",
                    "Change <code>exit(3)</code> to <code>exit(0)</code> and then to <code>exit(42)</code>. Does the parent's message follow?"
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 2",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>$?</code> holds the exit status of the last command the shell ran: that was <code>./fork2</code>, the <em>parent</em>, which returned 0 from <code>main</code>. The child's status went to the parent through <code>waitpid</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "exercise",
              label: "Stretch: catch a zombie",
              blocks: [
                {
                  type: "paragraph",
                  html: "Copy <code>fork2.c</code> to <code>zombie.c</code>. Make the child exit immediately and make the parent <code>sleep(30)</code> <em>instead of</em> calling <code>waitpid</code>. While the parent sleeps, open a second terminal and look at the process list. You are looking for a state of <code>Z</code>."
                },
                {
                  type: "hint",
                  summary: "Hint",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Print the parent's PID in the program so you know what to look for, then run <code>ps -o pid,ppid,stat,comm --ppid</code> followed by that PID. The <code>STAT</code> column shows <code>Z</code> for the dead child nobody has collected."
                    }
                  ]
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Why do we use <code>WEXITSTATUS(status)</code> instead of printing <code>status</code>?",
                  answer: "<code>status</code> packs several facts (exited normally, killed by a signal, the exit code) into one number. The macros unpack them."
                },
                {
                  question: "What is a zombie process?",
                  answer: "A child that has finished but whose parent has not yet collected its exit status with <code>wait</code> or <code>waitpid</code>."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "<code>fork2</code> works and I can predict its output for any exit code.",
                "I found <code>WIFEXITED</code> and <code>WEXITSTATUS</code> in the manual myself.",
                "I can explain why a parent should always wait for its children."
              ]
            }
          ]
        },
        {
          id: "s2-4",
          no: "2.4",
          title: "exec: swapping the program",
          blocks: [
            {
              type: "paragraph",
              html: "The <code>exec</code> family replaces the program inside the calling process with a different one. The <strong>PID stays the same</strong>, the parent stays the same, but the code and variables are thrown away and the new program starts from its <code>main</code>. The cook keeps the ticket number and swaps the recipe."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "If <code>exec</code> succeeds it <strong>never returns</strong>, because the code that would receive the return is gone. Lines after it only run if it <em>failed</em>.",
                "The family has several members. The letters after <code>exec</code> say how you call it: <code>l</code> arguments as a list, <code>v</code> arguments in an array (“vector”), <code>p</code> search the <code>PATH</code> for the program, <code>e</code> also pass an environment.",
                "With the <code>v</code> forms you pass an array of strings. By convention the first element is the program's own name and the last element is <code>NULL</code>. It is the same <code>argv</code> that the new program receives in <code>main(int argc, char *argv[])</code>."
              ]
            },
            {
              type: "exercise",
              label: "Task: look it up first",
              blocks: [
                {
                  type: "paragraph",
                  html: "Open <code>man 3 exec</code>. Find the SYNOPSIS, list the six functions, and work out from the letters which one takes (a) a path and an array, (b) a name searched in <code>PATH</code> and an array."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: type, predict, run",
              blocks: [
                {
                  type: "code",
                  language: "c",
                  label: "fork3.c",
                  code: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }
    if (pid == 0) {
        char *args[] = {"ls", "-l", NULL};
        execvp("ls", args);
        perror("exec failed");   /* only runs if exec fails */
        exit(127);
    }
    int status;
    waitpid(pid, &status, 0);
    printf("parent: child finished\n");
    return 0;
}`
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Run it. Where does the <code>ls</code> output appear, and why does the child not need any special setup to print there?",
                    "Change <code>\"ls\"</code> in the <code>execvp</code> call to <code>\"lss\"</code>. Predict what is printed, then run it. Add a line in the parent to print the child's exit status. What do you see?",
                    "Change <code>execvp(\"ls\", args)</code> to <code>execv(\"ls\", args)</code>. Predict, then run. Now try <code>execv(\"/bin/ls\", args)</code>."
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 1",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "The child inherits the parent's open files, including standard output. <code>exec</code> keeps them open."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 3",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>execv</code> does not search <code>PATH</code>, it wants a real path. <code>execvp</code> does search. This matters in Phase 3: your child programs sit in the current folder and are not in <code>PATH</code>, so the calculator will call <code>execv</code> with a path like <code>./add</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "Why 127?",
              blocks: [
                {
                  type: "paragraph",
                  html: "Shells use exit status 127 for “command not found”. Using the same number when <code>exec</code> fails is a widespread habit, so you will use it too."
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "After a successful <code>exec</code>, does the next line of your code run?",
                  answer: "No. The old program has been replaced, so execution never comes back. Only a failed <code>exec</code> returns (with -1)."
                },
                {
                  question: "Does the PID change when a process calls <code>exec</code>?",
                  answer: "No. It is the same process running a different program."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "<code>fork3</code> runs, and I tried the typo and the <code>execv</code> experiments.",
                "I can explain what the letters <code>l v p e</code> mean in <code>exec</code> names.",
                "I know why a successful <code>exec</code> never returns."
              ]
            }
          ]
        },
        {
          id: "s2-5",
          no: "2.5",
          title: "All three together",
          blocks: [
            {
              type: "paragraph",
              html: "This is the pattern the calculator is built on: fork, the child execs, the parent waits and reports. Here it runs <code>expr</code>, an existing program that does integer arithmetic, so you can see the whole thing work before writing any of your own."
            },
            {
              type: "code",
              language: "shell",
              label: "try expr in the shell first",
              code: String.raw`$ expr 2 + 3
5
$ expr 2 + x
expr: non-integer argument
$ echo $?
2`
            },
            {
              type: "exercise",
              label: "Task: type, predict, run",
              blocks: [
                {
                  type: "code",
                  language: "c",
                  label: "mini.c",
                  code: String.raw`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char *args[] = {"expr", "2", "+", "3", NULL};

    fflush(stdout);
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }
    if (pid == 0) {
        execvp("expr", args);
        perror("expr");
        _exit(127);
    }

    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status) && WEXITSTATUS(status) == 0) {
        printf("child process exited successfully (PID %d)\n", pid);
    } else {
        printf("child process failed\n");
    }
    return 0;
}`
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Run it. Which line comes first, the <code>5</code> or the parent's message? Why is that order guaranteed?",
                    "Change <code>\"3\"</code> to <code>\"x\"</code> and run again. Predict both lines.",
                    "Read <code>man 2 _exit</code> and <code>man 3 exit</code>. Why does the child call <code>_exit</code> after a failed exec instead of <code>exit</code>? (You may not fully understand the answer yet. Write down your best guess.)"
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 1",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "The parent calls <code>waitpid</code> before it prints, so it cannot print until the child has ended, and the child prints its result before it ends."
                    }
                  ]
                }
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "What comes next",
              blocks: [
                {
                  type: "paragraph",
                  html: "That is roughly 80% of <code>calculator.c</code>. In Phase 3 you replace <code>expr</code> with your own programs, and the fixed array with whatever the user typed."
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Put these in order: <code>waitpid</code>, <code>fork</code>, <code>exec</code>. Which run in the parent and which in the child?",
                  answer: "<code>fork</code> runs in the parent (and returns in both). Then <code>exec</code> runs in the child while <code>waitpid</code> runs in the parent."
                },
                {
                  question: "How does the parent learn that the child failed?",
                  answer: "From the child's exit status, read with <code>waitpid</code> and <code>WEXITSTATUS</code>. By convention non-zero means failure."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Phase 2 checkpoint",
              items: [
                "<code>mini.c</code> works and I can explain every line in it.",
                "I can describe, without looking, what <code>fork</code>, <code>exec</code> and <code>waitpid</code> each do.",
                "I know which of them runs in the parent and which in the child."
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p3",
      label: "Phase 3",
      title: "Build the calculator",
      lessons: [
        {
          id: "p3-intro",
          no: "",
          title: "Overview",
          blocks: [
            {
              type: "lede",
              html: "The biggest phase. You write the whole project yourself, in six small steps, each ending with something you can run. You get the plan, skeletons, search terms and staged hints, not the code."
            }
          ]
        },
        {
          id: "s3-0",
          no: "3.0",
          title: "The blueprint",
          blocks: [
            {
              type: "lede",
              html: "Read this step completely before you type anything. It is the contract every file must follow, so the five programs fit together even though you write them separately."
            },
            {
              type: "heading",
              level: 4,
              html: "Decisions already made for you"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Numbers are <strong>integers</strong>. Use <code>long</code> in C.",
                "The operator names are <code>add</code>, <code>sub</code>, <code>multiply</code> and <code>negate</code>, and each is also the name of its program.",
                "The parent <strong>never does arithmetic</strong>. It checks the operator name and argument count. The <strong>child</strong> checks that its arguments are real numbers.",
                "The child prints the result itself. The parent learns <em>how it ended</em> from the exit status.",
                "The children live in the project folder, which is not in <code>PATH</code>, so the parent launches them as <code>./add</code>, <code>./sub</code> and so on."
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The contract"
            },
            {
              type: "table",
              head: ["Operator", "Arguments", "Program", "Prints on success"],
              rows: [
                ["<code>add</code>", "2", "<code>./add</code>", "<code>Result: A + B</code>"],
                ["<code>sub</code>", "2", "<code>./sub</code>", "<code>Result: A - B</code>"],
                [
                  "<code>multiply</code>",
                  "2",
                  "<code>./multiply</code>",
                  "<code>Result: A * B</code>"
                ],
                ["<code>negate</code>", "1", "<code>./negate</code>", "<code>Result: -A</code>"]
              ]
            },
            {
              type: "paragraph",
              html: "<strong>Every child program:</strong> reads its numbers from <code>argv</code>. On success it prints the result line to standard output and exits with status <code>0</code>. If the argument count is wrong or an argument is not an integer, it prints a message to <strong>standard error</strong> and exits with status <code>1</code>."
            },
            {
              type: "paragraph",
              html: "<strong>The parent</strong> prints exactly these messages. The text in capitals or between quotes is fixed; <code>N</code> and <code>PID</code> are numbers."
            },
            {
              type: "table",
              head: ["Situation", "The parent prints"],
              rows: [
                [
                  "Unknown operator",
                  "<code>Operation cannot execute: invalid operator \"divide\"</code>"
                ],
                [
                  "Wrong argument count",
                  "<code>Operation cannot execute: add needs 2 argument(s), got 1</code>"
                ],
                [
                  "Child exited with status 0",
                  "<code>child process exited successfully (PID 4243)</code>"
                ],
                [
                  "Child exited with status N ≠ 0",
                  "<code>child process exited unsuccessfully with status N (PID 4243)</code>"
                ],
                [
                  "Child was killed by a signal",
                  "<code>child process failed: killed by signal N (PID 4243)</code>"
                ]
              ]
            },
            {
              type: "paragraph",
              html: "In both error cases at the top, the parent does <strong>not</strong> fork. The prompt is <code>calc&gt; </code> (with a trailing space) and the words <code>exit</code> or <code>quit</code>, or <kbd>Ctrl</kbd>+<kbd>D</kbd>, end the program with status 0."
            },
            {
              type: "heading",
              level: 4,
              html: "The workflow"
            },
            {
              type: "figure",
              svg: "<svg aria-label=\"Workflow: the parent reads and checks a line, forks, and waits; the child execs a program that exits with a status the parent reports\" role=\"img\" viewbox=\"0 0 760 410\">\n<defs><marker id=\"ah2\" markerheight=\"7\" markerwidth=\"7\" orient=\"auto-start-reverse\" refx=\"9\" refy=\"5\" viewbox=\"0 0 10 10\"><path d=\"M0 0L10 5L0 10z\" fill=\"var(--muted)\"></path></marker></defs>\n<rect class=\"sv-lane\" height=\"392\" rx=\"10\" width=\"380\" x=\"24\" y=\"8\"></rect>\n<rect class=\"sv-lane\" height=\"392\" rx=\"10\" width=\"284\" x=\"458\" y=\"8\"></rect>\n<text class=\"sv-h\" x=\"40\" y=\"28\">Parent: calculator.c</text>\n<text class=\"sv-h\" x=\"474\" y=\"28\">Child: starts as a copy</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"40\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"62\">Read a line</text><text class=\"sv-s\" x=\"50\" y=\"80\">prompt, fgets, split into words</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"106\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"128\">Check the line</text><text class=\"sv-s\" x=\"50\" y=\"146\">bad operator or count: message, then next prompt</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"172\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"194\">fork()</text><text class=\"sv-s\" x=\"50\" y=\"212\">the parent receives the child's PID</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"238\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"260\">waitpid(pid, &amp;status, 0)</text><text class=\"sv-s\" x=\"50\" y=\"278\">sleeps until the child ends</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"304\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"326\">Report</text><text class=\"sv-s\" x=\"50\" y=\"344\">exited successfully or unsuccessfully, with the PID</text>\n<path class=\"sv-line\" d=\"M214 90V106\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 156V172\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 222V238\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 288V304\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 354V378H10V65H34\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-s\" x=\"224\" y=\"372\">loop: back to the prompt</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"172\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"194\">Child begins</text><text class=\"sv-s\" x=\"486\" y=\"212\">a copy; fork returned 0 here</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"238\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"260\">execv(\"./add\", argv)</text><text class=\"sv-s\" x=\"486\" y=\"278\">same PID, new program</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"304\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"326\">add runs</text><text class=\"sv-s\" x=\"486\" y=\"344\">checks arguments, prints Result</text>\n<path class=\"sv-line\" d=\"M392 197H470\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-a\" text-anchor=\"middle\" x=\"431\" y=\"189\">fork</text>\n<path class=\"sv-line\" d=\"M600 222V238\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M600 288V304\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line dash\" d=\"M472 329H394\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"433\" y=\"321\">exit status</text>\n</svg>",
              caption: "While the parent waits, the child becomes <code>add</code>. When <code>add</code> ends, its exit status travels back to the waiting parent."
            },
            {
              type: "heading",
              level: 4,
              html: "The build order"
            },
            {
              type: "paragraph",
              html: "You will build from the smallest piece outward, and run every piece on its own before connecting it to the next."
            },
            {
              type: "list",
              ordered: true,
              items: [
                "<strong>3.1</strong> <code>negate.c</code>, fully guided. It teaches everything a child needs.",
                "<strong>3.2</strong> <code>add.c</code>, <code>sub.c</code>, <code>multiply.c</code>, mostly on your own.",
                "<strong>3.3</strong> <code>calculator.c</code> part A: the prompt and the words.",
                "<strong>3.4</strong> part B: check the operator and the argument count.",
                "<strong>3.5</strong> part C: fork, exec, wait, report.",
                "<strong>3.6</strong> polish, break it, and look at the real processes."
              ]
            },
            {
              type: "note",
              variant: "story",
              label: "In the kitchen story",
              blocks: [
                {
                  type: "paragraph",
                  html: "Build the line cooks first and make sure each one can cook alone. Only then hire the head cook who hands out the orders."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can say, without looking, who checks the operator, who checks the numbers, and who prints the result.",
                "I understand why the children are started as <code>./add</code> and not <code>add</code>."
              ]
            }
          ]
        },
        {
          id: "s3-1",
          no: "3.1",
          title: "negate.c: your first child",
          blocks: [
            {
              type: "paragraph",
              html: "<strong>Goal:</strong> a program that takes one argument and prints its negation, and refuses bad input. It is the smallest child, and everything you learn here repeats in the next three."
            },
            {
              type: "heading",
              level: 4,
              html: "Ideas you need"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<strong>Arguments.</strong> The shell splits your command into words and the program receives them as <code>argc</code> and <code>argv</code>. <code>argv[0]</code> is the program's name, so <code>./negate 5</code> gives <code>argc == 2</code>.",
                "<strong>Text is not a number.</strong> <code>argv[1]</code> is the string <code>\"5\"</code>. You must convert it, and you must notice when the conversion fails.",
                "<strong>Exit status.</strong> What <code>main</code> returns. <code>0</code> means success. The parent will read it.",
                "<strong>Two output streams.</strong> Results go to standard output, errors go to standard error. They look the same on screen but can be separated."
              ]
            },
            {
              type: "exercise",
              label: "Task: read first",
              blocks: [
                {
                  type: "paragraph",
                  html: "Open <code>man 3 atoi</code> and <code>man 3 strtol</code>. Answer in writing:"
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "What does <code>atoi</code> return for the text <code>\"abc\"</code>? Can you tell that apart from the text <code>\"0\"</code>?",
                    "What does <code>strtol</code> store through its second parameter, <code>endptr</code>?",
                    "How does <code>strtol</code> report that a number was too large?",
                    "Which two headers will you need? (Check the SYNOPSIS of <code>strtol</code> and the page for <code>errno</code>.)"
                  ]
                }
              ]
            },
            {
              type: "hint",
              summary: "Search terms if you want more",
              blocks: [
                {
                  type: "paragraph",
                  html: "<code>man 3 errno</code> · <code>man 3 fprintf</code> · “C strtol check whole string was converted” · “C stdout vs stderr”"
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The skeleton"
            },
            {
              type: "paragraph",
              html: "Type this into <code>negate.c</code> and replace each TODO with real code."
            },
            {
              type: "code",
              language: "c",
              label: "negate.c",
              code: String.raw`#include <stdio.h>
/* TODO: strtol lives in another header. Which one? (man 3 strtol) */
/* TODO: you also want errno and ERANGE. Which header? (man 3 errno) */

int main(int argc, char *argv[]) {
    /* TODO 1: negate needs exactly one argument.
       If argc says otherwise, print a usage message to stderr and return 1. */

    /* TODO 2: convert argv[1] to a long with strtol.
       Reject text that is not a complete, in-range integer:
       print an error to stderr and return 1. */

    /* TODO 3: print "Result: " and the negated number, then return 0. */
}`
            },
            {
              type: "heading",
              level: 4,
              html: "Hints, one at a time"
            },
            {
              type: "hint",
              summary: "TODO 1, hint 1: counting",
              blocks: [
                {
                  type: "paragraph",
                  html: "Remember that <code>argv[0]</code> counts. One real argument means what value of <code>argc</code>?"
                }
              ]
            },
            {
              type: "hint",
              summary: "TODO 1, hint 2: printing to stderr",
              blocks: [
                {
                  type: "paragraph",
                  html: "Use <code>fprintf</code> with <code>stderr</code> as its first argument. You can use <code>argv[0]</code> inside the message so it names the program."
                }
              ]
            },
            {
              type: "hint",
              summary: "TODO 2, hint 1: the shape",
              blocks: [
                {
                  type: "paragraph",
                  html: "Declare <code>char *end;</code> and pass <code>&amp;end</code> (the address of that pointer) as the second argument. The base is 10. After the call, <code>end</code> points at the first character <code>strtol</code> could not use."
                }
              ]
            },
            {
              type: "hint",
              summary: "TODO 2, hint 2: spotting bad input",
              blocks: [
                {
                  type: "paragraph",
                  html: "Two things go wrong. If <code>end</code> is still equal to <code>argv[1]</code>, nothing was converted (<code>abc</code>). If <code>*end</code> is not the end-of-string character <code>'\\0'</code>, something followed the number (<code>12abc</code>)."
                }
              ]
            },
            {
              type: "hint",
              summary: "TODO 2, hint 3: too large",
              blocks: [
                {
                  type: "paragraph",
                  html: "Overflow is reported through <code>errno</code> being set to <code>ERANGE</code>. Because <code>errno</code> may hold an old value, set <code>errno = 0</code> just before calling <code>strtol</code> and check it right after. The ERRORS section of the man page says the same."
                }
              ]
            },
            {
              type: "hint",
              summary: "TODO 3: printing",
              blocks: [
                {
                  type: "paragraph",
                  html: "A <code>long</code> is printed with <code>%ld</code>. Negation is the unary minus. Do not forget the newline."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Compile and test"
            },
            {
              type: "code",
              language: "shell",
              label: "terminal",
              code: String.raw`$ gcc -Wall -Wextra -o negate negate.c`
            },
            {
              type: "paragraph",
              html: "Those flags are explained in Phase 4. For now, treat any warning as a real problem. Then check every row. Run each command and then <code>echo $?</code> to see the exit status."
            },
            {
              type: "table",
              head: ["You run", "Expected", "Exit status"],
              rows: [
                ["<code>./negate 5</code>", "<code>Result: -5</code>", "0"],
                ["<code>./negate -12</code>", "<code>Result: 12</code>", "0"],
                ["<code>./negate 0</code>", "<code>Result: 0</code>", "0"],
                ["<code>./negate abc</code>", "an error message", "1"],
                ["<code>./negate 12abc</code>", "an error message", "1"],
                ["<code>./negate</code>", "a usage message", "1"],
                ["<code>./negate 1 2</code>", "a usage message", "1"],
                ["<code>./negate 99999999999999999999</code>", "an error message", "1"]
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "Prove stderr is separate",
              blocks: [
                {
                  type: "paragraph",
                  html: "Run <code>./negate abc 2&gt;/dev/null</code>. Where did your error message go? <code>2&gt;</code> redirects stream number 2, standard error, to a place that discards everything. Then run <code>./negate 5 2&gt;/dev/null</code>. The result still shows, because it travels on stream 1."
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Why <code>argc == 2</code> for one argument?",
                  answer: "Because <code>argv[0]</code> is the program's name and counts as the first word."
                },
                {
                  question: "Why <code>strtol</code> and not <code>atoi</code>?",
                  answer: "<code>atoi</code> returns 0 for bad text, which you cannot tell from a real 0. <code>strtol</code> tells you where it stopped and sets <code>errno</code> on overflow, so you can detect bad input."
                },
                {
                  question: "Which part of this program will be identical in <code>add</code>, <code>sub</code> and <code>multiply</code>?",
                  answer: "The conversion and its checks. You will need it twice per file, which is a hint about how to organise it in 3.2."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "<code>negate</code> compiles with no warnings.",
                "All eight rows of the table behave as expected, including the exit statuses.",
                "I can explain why <code>strtol</code> is used and how the error cases are detected.",
                "I proved that errors go to stderr with <code>2&gt;/dev/null</code>."
              ]
            }
          ]
        },
        {
          id: "s3-2",
          no: "3.2",
          title: "add, sub and multiply",
          blocks: [
            {
              type: "paragraph",
              html: "<strong>Goal:</strong> three more children, written mostly on your own. You already know every idea; this step is about changing them correctly."
            },
            {
              type: "heading",
              level: 4,
              html: "What is different from negate"
            },
            {
              type: "table",
              head: ["Program", "Needs <code>argc</code> equal to", "Numbers to convert", "Result line"],
              rows: [
                ["<code>add</code>", "3", "two", "<code>Result: A + B</code>"],
                ["<code>sub</code>", "3", "two", "<code>Result: A - B</code> (order matters)"],
                ["<code>multiply</code>", "3", "two", "<code>Result: A * B</code>"]
              ]
            },
            {
              type: "paragraph",
              html: "You convert two strings, and both conversions must be checked. Writing the same ten lines twice in one file is a bad sign. Think about how a small function could do it."
            },
            {
              type: "heading",
              level: 4,
              html: "Hints, one at a time"
            },
            {
              type: "hint",
              summary: "Hint 1: structure",
              blocks: [
                {
                  type: "paragraph",
                  html: "Write a helper function above <code>main</code> that converts one string and tells you whether it worked. <code>main</code> then calls it twice and stops at the first failure."
                }
              ]
            },
            {
              type: "hint",
              summary: "Hint 2: the helper's signature",
              blocks: [
                {
                  type: "paragraph",
                  html: "A function can return only one value, but you need two things back: “did it work” and “the number”. Return the first and hand back the second through a pointer parameter:"
                },
                {
                  type: "code",
                  language: "c",
                  label: "signature only",
                  code: String.raw`/* Convert text to a long. Return 0 on success and store the number in *out.
   Return -1 if text is not a complete, in-range integer. */
static int parse_long(const char *text, long *out);`
                },
                {
                  type: "paragraph",
                  html: "You write the body. It is the code from <code>negate</code>, moved."
                }
              ]
            },
            {
              type: "hint",
              summary: "Hint 3: using it",
              blocks: [
                {
                  type: "paragraph",
                  html: "Declare <code>long a, b;</code> and call the helper with <code>&amp;a</code> and <code>&amp;b</code>. The <code>&amp;</code> gives the function the address where it should write the answer."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Test tables"
            },
            {
              type: "paragraph",
              html: "Test each program alone, and check <code>echo $?</code> for the failing rows."
            },
            {
              type: "table",
              head: ["You run", "Expected", "Exit"],
              rows: [
                ["<code>./add 2 3</code>", "<code>Result: 5</code>", "0"],
                ["<code>./add -4 9</code>", "<code>Result: 5</code>", "0"],
                ["<code>./add 2 x</code>", "error message", "1"],
                ["<code>./add 2</code>", "usage message", "1"],
                ["<code>./sub 10 4</code>", "<code>Result: 6</code>", "0"],
                ["<code>./sub 4 10</code>", "<code>Result: -6</code>", "0"],
                ["<code>./sub 5 -3</code>", "<code>Result: 8</code>", "0"],
                ["<code>./sub x 1</code>", "error message", "1"],
                ["<code>./multiply 6 7</code>", "<code>Result: 42</code>", "0"],
                ["<code>./multiply -3 4</code>", "<code>Result: -12</code>", "0"],
                ["<code>./multiply 0 99</code>", "<code>Result: 0</code>", "0"],
                ["<code>./multiply 1 2 3</code>", "usage message", "1"]
              ]
            },
            {
              type: "hint",
              summary: "If a row fails",
              blocks: [
                {
                  type: "paragraph",
                  html: "Read the exact output, then ask: did the program reach the line I think it reached? Add a temporary <code>fprintf(stderr, ...)</code> to see. Compare with <code>negate</code>, which you know works."
                }
              ]
            },
            {
              type: "exercise",
              label: "Stretch",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<strong>Overflow.</strong> <code>./multiply 9999999999 9999999999</code> may print a nonsense number. Why? Search for “gcc __builtin_mul_overflow” and make the program report an error instead.",
                    "<strong>One header.</strong> Move <code>parse_long</code> into a file <code>parse.h</code> and <code>#include \"parse.h\"</code> from all four children. Predict whether your compile command has to change, then try it. What does that tell you about when a header file is read?"
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "<code>add</code> compiles cleanly and passes its rows.",
                "<code>sub</code> compiles cleanly and passes its rows, including the order of operands.",
                "<code>multiply</code> compiles cleanly and passes its rows.",
                "I used a helper function instead of repeating the conversion code."
              ]
            }
          ]
        },
        {
          id: "s3-3",
          no: "3.3",
          title: "calculator.c, part A: the prompt",
          blocks: [
            {
              type: "paragraph",
              html: "<strong>Goal:</strong> a program that shows <code>calc&gt; </code>, reads a line, splits it into words and prints them back. It does not calculate or fork yet. Splitting words correctly is half of the parent's job, so test it hard."
            },
            {
              type: "heading",
              level: 4,
              html: "Ideas you need"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<strong>A loop that waits for input.</strong> Read a line, handle it, repeat, until the user says to stop.",
                "<strong>Reading a line.</strong> <code>fgets</code> reads one line from a stream into a char array. It returns <code>NULL</code> when there is no more input, which is what <kbd>Ctrl</kbd>+<kbd>D</kbd> produces.",
                "<strong>Splitting into words.</strong> <code>strtok</code> cuts a string at delimiter characters. It <em>modifies</em> the string and gives you pointers into it.",
                "<strong>Buffered output.</strong> A prompt has no newline, so it may sit in the output buffer. Flushing makes it appear."
              ]
            },
            {
              type: "exercise",
              label: "Task: read first",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<code>man 3 fgets</code>: what are its three parameters, and what does it return at end of input? Does it keep the newline?",
                    "<code>man 3 strtok</code>: what does the first call look like, and how do the following calls differ? Which header is needed?",
                    "<code>man 3 strcmp</code>: what does it return when two strings are equal?"
                  ]
                }
              ]
            },
            {
              type: "hint",
              summary: "Search terms if you want more",
              blocks: [
                {
                  type: "paragraph",
                  html: "“C read a line from stdin fgets” · “C strtok example split by spaces” · “C fflush stdout prompt” · “C compare strings strcmp equals zero”"
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The skeleton"
            },
            {
              type: "code",
              language: "c",
              label: "calculator.c",
              code: "#include <stdio.h>\n/* TODO: strtok and strcmp live in which header? (man 3 strtok) */\n\n#define MAX_LINE   256\n#define MAX_TOKENS 16\n\nint main(void) {\n    char line[MAX_LINE];\n\n    while (1) {\n        /* TODO A1: print the prompt \"calc> \" and make sure it appears\n           before the program waits for input. */\n\n        /* TODO A2: read a line into `line`. If there is no more input\n           (Ctrl+D), print a newline and leave the loop. */\n\n        char *tokens[MAX_TOKENS + 1];   /* one spare slot: you will see why in 3.5 */\n        int ntokens = 0;\n        /* TODO A3: split `line` into words. Put pointers to them in tokens[]\n           and count them in ntokens. Stop at MAX_TOKENS words. Delimiters:\n           space, tab, and the newline that fgets keeps. */\n\n        /* TODO A4: an empty line -> go round the loop again.\n           The word \"exit\" or \"quit\" as the first word -> leave the loop. */\n\n        /* TODO A5 (temporary): print every word on its own line,\n           so you can see how the line was split. */\n    }\n    return 0;\n}"
            },
            {
              type: "heading",
              level: 4,
              html: "Hints, one at a time"
            },
            {
              type: "hint",
              summary: "A1: the prompt",
              blocks: [
                {
                  type: "paragraph",
                  html: "<code>printf</code> without a newline may leave the text in a buffer. <code>fflush(stdout)</code> sends it out immediately. Some systems flush for you when you read input and some do not, so always flush a prompt."
                }
              ]
            },
            {
              type: "hint",
              summary: "A2: reading",
              blocks: [
                {
                  type: "paragraph",
                  html: "The three arguments are the array, how many characters it can hold (use <code>sizeof line</code> so the number cannot go out of date) and the stream, <code>stdin</code>. Check the return value against <code>NULL</code>."
                }
              ]
            },
            {
              type: "hint",
              summary: "A3, hint 1: the loop shape",
              blocks: [
                {
                  type: "paragraph",
                  html: "The first call to <code>strtok</code> receives the string. Every call after that receives <code>NULL</code> instead, which means “carry on from where you stopped”. It returns <code>NULL</code> when there are no more words. A <code>for</code> loop with the first call in its initialiser and the second in its step works well."
                }
              ]
            },
            {
              type: "hint",
              summary: "A3, hint 2: the delimiter string",
              blocks: [
                {
                  type: "paragraph",
                  html: "The delimiters are given as a string containing every separator character. Write a space, a tab (<code>\\t</code>) and a newline (<code>\\n</code>) inside one string. Including the newline is what removes the one <code>fgets</code> left at the end."
                }
              ]
            },
            {
              type: "hint",
              summary: "A4: comparing words",
              blocks: [
                {
                  type: "paragraph",
                  html: "<code>strcmp</code> returns <code>0</code> when the strings are equal, so you test <code>== 0</code>. Using <code>==</code> on two strings compares addresses, not text, and is almost never what you want. Check <code>ntokens</code> before you look at <code>tokens[0]</code>."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Run it and compare"
            },
            {
              type: "paragraph",
              html: "Compile with <code>gcc -Wall -Wextra -o calculator calculator.c</code>, run <code>./calculator</code> and type the lines after each prompt. This is what you should see:"
            },
            {
              type: "code",
              language: "shell",
              label: "expected session",
              code: String.raw`$ ./calculator
calc> add 2 3
add
2
3
calc>    multiply   4   5
multiply
4
5
calc>
calc> exit
$ ./calculator
calc> <press Ctrl+D>
$`
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Why do we include <code>\\n</code> in the list of delimiters?",
                  answer: "<code>fgets</code> keeps the newline at the end of the line. Without it the last word would be <code>\"3\\n\"</code> instead of <code>\"3\"</code>, and later <code>strtol</code> would reject it."
                },
                {
                  question: "Why is the tokens array one element bigger than <code>MAX_TOKENS</code>?",
                  answer: "You will see in 3.5: the array handed to <code>exec</code> must end with <code>NULL</code>. The spare slot is where that goes."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "The prompt appears, repeats, and the program exits on <code>exit</code>, <code>quit</code> and <kbd>Ctrl</kbd>+<kbd>D</kbd>.",
                "Extra spaces and tabs between words do not matter; a blank line just shows the prompt again.",
                "I can explain what <code>strtok</code> does to the string it is given."
              ]
            }
          ]
        },
        {
          id: "s3-4",
          no: "3.4",
          title: "calculator.c, part B: check the line",
          blocks: [
            {
              type: "paragraph",
              html: "<strong>Goal:</strong> decide whether a line is a valid request <em>before</em> any process exists. Wrong lines get the exact messages from the blueprint. Right lines print a temporary “OK”."
            },
            {
              type: "heading",
              level: 4,
              html: "Ideas you need"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<strong>Data instead of if-chains.</strong> The four operations differ only by name and argument count. Put those two facts in a table (an array of structs) and look the word up. Adding a fifth operation later becomes one new row.",
                "<strong>Arguments are the words after the first.</strong> With <code>ntokens</code> words, there are <code>ntokens - 1</code> arguments.",
                "The parent only checks the <em>count</em>. It does not check whether <code>abc</code> is a number. That is the child's job, as the contract says."
              ]
            },
            {
              type: "exercise",
              label: "Task: read first",
              blocks: [
                {
                  type: "paragraph",
                  html: "If you have not used structs in C yet, search for “C array of structs initialiser” and “C number of elements in an array sizeof”. Write down the answers to both before you start coding."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The additions"
            },
            {
              type: "code",
              language: "c",
              label: "calculator.c (new parts)",
              code: String.raw`struct operation {
    const char *name;   /* what the user types; also the program's name */
    int nargs;          /* how many arguments it needs */
};

/* TODO B1: create the table: an array of struct operation with the four
   operations and their argument counts. */

/* ...inside the loop, after the exit/quit check from part A: */

    /* TODO B2: look tokens[0] up in the table.
       Not found -> print the "invalid operator" message and go round again. */

    /* TODO B3: compare ntokens - 1 with the operation's nargs.
       Different -> print the "needs N argument(s), got M" message and go round again. */

    /* TODO B4 (temporary): print "OK: would run <name> with <n> argument(s)" */`
            },
            {
              type: "heading",
              level: 4,
              html: "Hints, one at a time"
            },
            {
              type: "hint",
              summary: "B1: the table",
              blocks: [
                {
                  type: "paragraph",
                  html: "Declare it <code>static const</code> above <code>main</code>. Each row is <code>{\"name\", count}</code>. To get the number of rows without hard-coding it, divide the size of the whole array by the size of one element."
                }
              ]
            },
            {
              type: "hint",
              summary: "B2: the lookup",
              blocks: [
                {
                  type: "paragraph",
                  html: "Loop over the rows and use <code>strcmp</code>. Keep a pointer to the matching row, or <code>NULL</code> if none matched. After the loop one <code>if</code> handles the not-found case."
                }
              ]
            },
            {
              type: "hint",
              summary: "B3 and the messages",
              blocks: [
                {
                  type: "paragraph",
                  html: "Print with <code>%s</code> for the operator name and <code>%d</code> for counts. The wording must match the blueprint exactly, including <code>argument(s)</code> and the double quotes around the invalid operator, which you write as <code>\\\"</code> inside a C string."
                }
              ]
            },
            {
              type: "table",
              head: ["You type", "Expected"],
              rows: [
                ["<code>add 2 3</code>", "<code>OK: would run add with 2 argument(s)</code>"],
                [
                  "<code>negate 7</code>",
                  "<code>OK: would run negate with 1 argument(s)</code>"
                ],
                [
                  "<code>add 2</code>",
                  "<code>Operation cannot execute: add needs 2 argument(s), got 1</code>"
                ],
                [
                  "<code>negate</code>",
                  "<code>Operation cannot execute: negate needs 1 argument(s), got 0</code>"
                ],
                [
                  "<code>multiply 1 2 3</code>",
                  "<code>Operation cannot execute: multiply needs 2 argument(s), got 3</code>"
                ],
                [
                  "<code>divide 4 2</code>",
                  "<code>Operation cannot execute: invalid operator \"divide\"</code>"
                ],
                [
                  "<code>ADD 2 3</code>",
                  "<code>Operation cannot execute: invalid operator \"ADD\"</code>"
                ],
                [
                  "<code>add 2 abc</code>",
                  "<code>OK: would run add with 2 argument(s)</code> (letters are the child's problem)"
                ]
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "All eight rows behave as shown, and the program still quits cleanly.",
                "The operations live in a table, not in a chain of <code>if</code>s.",
                "I can explain why <code>add 2 abc</code> passes here."
              ]
            }
          ]
        },
        {
          id: "s3-5",
          no: "3.5",
          title: "calculator.c, part C: fork, exec, wait",
          blocks: [
            {
              type: "paragraph",
              html: "<strong>Goal:</strong> replace the temporary “OK” with the real thing: start the child, wait for it, report how it ended. This is the heart of the project and everything you did in Phase 2 comes together."
            },
            {
              type: "heading",
              level: 4,
              html: "The plan for one function"
            },
            {
              type: "paragraph",
              html: "Put the work in a function so the loop stays readable. It runs once per valid line."
            },
            {
              type: "code",
              language: "c",
              label: "calculator.c (new function)",
              code: String.raw`static void run_child(const char *name, char *tokens[], int ntokens) {
    /* TODO C1: build the string "./name" in a char array. */

    /* TODO C2: prepare the child's argument array: the path first, then the
       user's arguments, then NULL. */

    /* TODO C3: flush stdout, then fork. If fork fails, print why and return. */

    /* TODO C4: in the child only: replace it with the program using execv.
       If execv returns, it failed: print the reason and leave with status 127. */

    /* TODO C5: in the parent only: wait for that child and print one of the
       three report lines from the blueprint, including the child's PID. */
}`
            },
            {
              type: "paragraph",
              html: "In the loop, call <code>run_child(op-&gt;name, tokens, ntokens)</code> instead of printing the temporary OK line."
            },
            {
              type: "exercise",
              label: "Task: read first",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<code>man 3 snprintf</code>: how is it different from <code>printf</code>, and why is it safer than <code>sprintf</code>?",
                    "<code>man 3 exec</code>: which function takes a path and an array? What must the last element of the array be?",
                    "<code>man 2 waitpid</code>: which macro tells you the child ended normally? Which one gives the exit code? Which two describe a child killed by a signal?",
                    "<code>man 2 _exit</code> and <code>man 3 exit</code>: what extra does <code>exit</code> do that <code>_exit</code> does not?"
                  ]
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Hints, one at a time"
            },
            {
              type: "hint",
              summary: "C1: the path",
              blocks: [
                {
                  type: "paragraph",
                  html: "<code>snprintf</code> works like <code>printf</code> but writes into a char array. Give it the array, its size (<code>sizeof</code>) and a format such as <code>\"./%s\"</code>. An array of 64 characters is plenty."
                }
              ]
            },
            {
              type: "hint",
              summary: "C2, hint 1: what the array must look like",
              blocks: [
                {
                  type: "paragraph",
                  html: "For <code>add 2 3</code> the child must receive exactly four slots: <code>\"./add\"</code>, <code>\"2\"</code>, <code>\"3\"</code>, then <code>NULL</code>. It is the same <code>argv</code> that <code>add</code>'s <code>main</code> will see."
                }
              ]
            },
            {
              type: "hint",
              summary: "C2, hint 2: a shortcut",
              blocks: [
                {
                  type: "paragraph",
                  html: "You already have <code>tokens</code>: <code>{\"add\", \"2\", \"3\"}</code>. Only the first element is wrong. And the spare slot you reserved in 3.3 is exactly where the <code>NULL</code> belongs. You do not need a second array."
                }
              ]
            },
            {
              type: "hint",
              summary: "C3: fork",
              blocks: [
                {
                  type: "paragraph",
                  html: "Call <code>fflush(stdout)</code> first. You saw in 2.2 what happens to unsent output when you fork. Then check the result three ways: negative, zero, positive. Use <code>perror</code> for the failure message."
                }
              ]
            },
            {
              type: "hint",
              summary: "C4: the child branch",
              blocks: [
                {
                  type: "paragraph",
                  html: "In the zero branch call <code>execv</code> with your path and array. Anything written after it runs only on failure: print with <code>perror(path)</code> and call <code>_exit(127)</code>."
                },
                {
                  type: "paragraph",
                  html: "<strong>Why <code>_exit</code>?</strong> <code>exit</code> flushes the C library's output buffers. A forked child owns a copy of the parent's buffers, so flushing them in the child can print the parent's pending text a second time. <code>_exit</code> leaves immediately."
                }
              ]
            },
            {
              type: "hint",
              summary: "C5, hint 1: collecting the result",
              blocks: [
                {
                  type: "paragraph",
                  html: "Call <code>waitpid(pid, &amp;status, 0)</code> and check that it did not return -1. Then ask <code>WIFEXITED(status)</code> first. Only if that is true does <code>WEXITSTATUS(status)</code> mean anything."
                }
              ]
            },
            {
              type: "hint",
              summary: "C5, hint 2: three outcomes",
              blocks: [
                {
                  type: "paragraph",
                  html: "One <code>if</code>/<code>else if</code>/<code>else</code> covers it: exited with 0, exited with something else, or did not exit normally (killed by a signal; the macro that gives the signal number is in the man page you read)."
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Test it"
            },
            {
              type: "paragraph",
              html: "You need <code>add</code>, <code>sub</code>, <code>multiply</code> and <code>negate</code> compiled in the same folder. Your PIDs will differ."
            },
            {
              type: "code",
              language: "shell",
              label: "expected session",
              code: String.raw`$ ./calculator
calc> add 2 3
Result: 5
child process exited successfully (PID 4243)
calc> sub 10 4
Result: 6
child process exited successfully (PID 4247)
calc> negate 5
Result: -5
child process exited successfully (PID 4251)
calc> add 2 abc
./add: invalid argument
child process exited unsuccessfully with status 1 (PID 4255)
calc> multiply 6
Operation cannot execute: multiply needs 2 argument(s), got 1
calc> exit
$`
            },
            {
              type: "paragraph",
              html: "The line <code>./add: invalid argument</code> is the child's own error message, so your wording can differ. Every other line must match."
            },
            {
              type: "exercise",
              label: "Two experiments",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<strong>A child that cannot start.</strong> In another terminal, or after quitting, rename a program: <code>mv negate negate.off</code>. Run the calculator and type <code>negate 3</code>. What do you see, and what status is reported? Then undo with <code>mv negate.off negate</code>.",
                    "<strong>The PID is real.</strong> Note the PID printed after a calculation. Is it the same number every time? Does it ever match <code>echo $$</code> in your shell?"
                  ]
                },
                {
                  type: "hint",
                  summary: "What to expect",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "1: the child prints the reason from <code>perror</code> (<code>No such file or directory</code>) and the parent reports status 127. 2: a new child means a new PID every time. Neither is your shell's PID, because the parent of the child is the calculator, and the parent of the calculator is the shell."
                    }
                  ]
                }
              ]
            },
            {
              type: "selfcheck",
              items: [
                {
                  question: "Which code runs in the child, which in the parent, and which in both?",
                  answer: "Both: everything up to and including <code>fork</code>. Child only: the branch where <code>fork</code> returned 0 (<code>execv</code> and its failure handling). Parent only: the branch with a positive PID (<code>waitpid</code> and the report)."
                },
                {
                  question: "What happens to the child process's PID when it calls <code>execv</code>?",
                  answer: "It stays the same. The program inside the process changes."
                },
                {
                  question: "Why must the parent call <code>waitpid</code> before printing the report?",
                  answer: "The report needs the child's exit status, and the status only exists once the child has ended."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "A valid line starts a child, shows its result, and reports success with the PID.",
                "A failing child (<code>add 2 abc</code>) is reported as unsuccessful with status 1.",
                "A missing program is reported with status 127.",
                "The prompt always comes back <em>after</em> the child's output and the report line.",
                "I can explain why <code>_exit</code> is used after a failed <code>execv</code>."
              ]
            }
          ]
        },
        {
          id: "s3-6",
          no: "3.6",
          title: "Polish it, break it, look inside",
          blocks: [
            {
              type: "paragraph",
              html: "The program works on the lines you imagined. Now find out what it does with the lines you did not."
            },
            {
              type: "heading",
              level: 4,
              html: "Try to break it"
            },
            {
              type: "table",
              head: ["You type", "What should happen"],
              rows: [
                [
                  "<code>add   7   8</code> with extra spaces or tabs",
                  "Works like <code>add 7 8</code>"
                ],
                ["an empty line", "A new prompt, no message"],
                [
                  "<code>negate -5</code>",
                  "<code>Result: 5</code>. A leading minus is part of the number"
                ],
                [
                  "<code>add 1 2 3</code>",
                  "<code>Operation cannot execute: add needs 2 argument(s), got 3</code>"
                ],
                [
                  "<code>add 99999999999999999999 1</code>",
                  "Child reports an invalid argument, parent reports status 1"
                ],
                [
                  "<code>quit</code>, <code>exit</code>, <kbd>Ctrl</kbd>+<kbd>D</kbd>",
                  "The program ends and <code>echo $?</code> prints 0"
                ],
                [
                  "a line of more than 300 characters",
                  "Decide what <em>should</em> happen, then see what does. <code>man 3 fgets</code> explains the leftover"
                ],
                [
                  "more than 16 words on one line",
                  "Decide, then see. Is the message you print honest?"
                ]
              ]
            },
            {
              type: "exercise",
              label: "Task: watch the real process tree",
              blocks: [
                {
                  type: "paragraph",
                  html: "Prove to yourself that the PIDs and PPIDs from Phase 2 are exactly what your calculator creates."
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Temporarily add <code>sleep(10);</code> (and <code>#include &lt;unistd.h&gt;</code>) to the start of <code>main</code> in <code>add.c</code>. Recompile it.",
                    "Run the calculator and type <code>add 1 2</code>. While it waits, open a <strong>second terminal</strong>.",
                    "In the second terminal run <code>ps -o pid,ppid,stat,comm --forest</code>. Find <code>calculator</code> and <code>add</code>. Which one's PID is the other's PPID?",
                    "Also try <code>pstree -p $(pgrep -x calculator)</code>.",
                    "Wait for it to finish, and check that the PID in the report line matches what you saw.",
                    "Remove the <code>sleep</code> and recompile <code>add</code>."
                  ]
                },
                {
                  type: "hint",
                  summary: "What you should see",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>add</code> is listed under <code>calculator</code>, and its PPID equals the calculator's PID. The calculator's own PPID is your shell."
                    }
                  ]
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: make a child be killed",
              blocks: [
                {
                  type: "paragraph",
                  html: "Repeat the setup above with the 10 second sleep. While the child sleeps, run <code>kill -9</code> followed by the <code>add</code> PID from the second terminal. What does the calculator report? Which of your three report lines is that, and why could it not be “exited with status”?"
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Stretch ideas"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Add a <code>divide</code> operation. What should happen on division by zero, and which exit status should it use?",
                "Let the user type <code>help</code> to list the operations from your table.",
                "Print the PID of the calculator itself when it starts."
              ]
            },
            {
              type: "checkpoint",
              title: "Phase 3 checkpoint",
              items: [
                "I tried every row of the break-it table and know what the program does for each.",
                "I saw the parent and child in <code>ps</code> or <code>pstree</code> at the same time and read their PIDs and PPIDs.",
                "I made a child die from a signal and saw how the parent reported it.",
                "All five files are written by me, and I can explain every line."
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p4",
      label: "Phase 4",
      title: "Compile and test",
      lessons: [
        {
          id: "p4-intro",
          no: "",
          title: "Overview",
          blocks: [
            {
              type: "lede",
              html: "You have used the compiler since Phase 2 without knowing what you were asking it to do. Now you learn the flags properly, build all five programs, test them against the contract, and find out what to do when something is wrong."
            }
          ]
        },
        {
          id: "s4-1",
          no: "4.1",
          title: "What gcc really does",
          blocks: [
            {
              type: "paragraph",
              html: "One <code>gcc</code> command runs four tools in a row. Each flag below can stop the chain early so you can look at an intermediate result."
            },
            {
              type: "list",
              ordered: true,
              items: [
                "<strong>Preprocess.</strong> Handles lines that start with <code>#</code>: pastes the text of each <code>#include</code> file in. <code>-E</code> stops here.",
                "<strong>Compile.</strong> Turns C into assembly language. <code>-S</code> stops here.",
                "<strong>Assemble.</strong> Turns assembly into machine code in an object file (<code>.o</code>). <code>-c</code> stops here.",
                "<strong>Link.</strong> Joins your object file with library code such as <code>printf</code> into one runnable program."
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "The flags you should use every time"
            },
            {
              type: "code",
              language: "shell",
              label: "terminal",
              code: String.raw`$ gcc -Wall -Wextra -std=c11 -g -o negate negate.c`
            },
            {
              type: "table",
              head: ["Flag", "What it does"],
              rows: [
                [
                  "<code>-o name</code>",
                  "Names the output file. Without it you get <code>a.out</code>."
                ],
                [
                  "<code>-Wall</code>",
                  "Turns on the common warnings, such as a wrong <code>printf</code> format or an unused variable."
                ],
                [
                  "<code>-Wextra</code>",
                  "Turns on more warnings, such as unused parameters."
                ],
                [
                  "<code>-std=c11</code>",
                  "Compile as standard C11, so non-standard habits are flagged."
                ],
                [
                  "<code>-g</code>",
                  "Keeps debugging information in the program, for debuggers and better crash reports."
                ],
                [
                  "<code>-c</code>, <code>-E</code>, <code>-S</code>",
                  "Stop after assembling, preprocessing or compiling."
                ],
                [
                  "<code>-Werror</code>",
                  "Treat every warning as an error. Strict, good once your code is clean."
                ]
              ]
            },
            {
              type: "paragraph",
              html: "A warning is the compiler telling you it suspects a bug. Treat a warning as a failed build until you understand it."
            },
            {
              type: "exercise",
              label: "Task: look it up",
              blocks: [
                {
                  type: "paragraph",
                  html: "<code>man gcc</code> is enormous and nobody reads it from the top. Open it and use <kbd>/</kbd> to search for <code>-Wall</code>, then <code>-g</code>, then <code>-std=</code>. Write down in one line what each does in your own words."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task: watch the stages",
              blocks: [
                {
                  type: "code",
                  language: "shell",
                  label: "in ~/calc_project",
                  code: String.raw`$ gcc -E negate.c | wc -l
$ wc -l negate.c
$ gcc -c negate.c
$ file negate.o
$ gcc negate.o -o negate
$ file negate
$ ls -l negate.c negate.o negate
$ negate 5
$ echo $PATH`
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "The preprocessed output is far longer than your file. On a typical system roughly two thousand lines against about thirty. Where did the extra lines come from?",
                    "What does <code>file</code> say about the <code>.o</code> file compared with the final program?",
                    "<code>negate 5</code> without <code>./</code> fails. Read the message and then the <code>PATH</code> you printed. Why is the project folder not found? What would you have to change to make it work?"
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 3",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "The shell only looks for programs in the directories listed in <code>PATH</code>. Your project folder is not one of them. That is why you write <code>./negate</code>, and why <code>calculator</code> asks <code>execv</code> for <code>./add</code>."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can name the four stages and the flag that stops after each of the first three.",
                "I can explain <code>-Wall</code>, <code>-Wextra</code>, <code>-g</code>, <code>-std=c11</code> and <code>-o</code>.",
                "I understand why <code>./</code> is needed and how it relates to <code>PATH</code>."
              ]
            }
          ]
        },
        {
          id: "s4-2",
          no: "4.2",
          title: "Build everything, read the errors",
          blocks: [
            {
              type: "exercise",
              label: "Task: one command for all five",
              blocks: [
                {
                  type: "paragraph",
                  html: "Typing five long <code>gcc</code> lines invites mistakes. Write <strong>one command line</strong> that compiles <code>add</code>, <code>sub</code>, <code>multiply</code>, <code>negate</code> and <code>calculator</code> with the full flag set. It should work for every name without you retyping the flags."
                },
                {
                  type: "hint",
                  summary: "Hint 1: the shell has loops",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "Try <code>for x in a b c; do echo $x; done</code> and see what happens. <code>$x</code> is replaced with each word in turn."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint 2: one name, two uses",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "The same variable gives you both the output name (<code>add</code>) and the source file (<code>add.c</code>). The shell lets you write <code>$name.c</code>."
                    }
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint 3: the shape",
                  blocks: [
                    {
                      type: "code",
                      language: "shell",
                      label: "fill in the dots",
                      code: String.raw`$ for name in ... ; do gcc ... -o $name $name.c ; done`
                    },
                    {
                      type: "paragraph",
                      html: "If one program fails to compile, the loop carries on, so read the output from the top."
                    }
                  ]
                }
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Reading a compiler message"
            },
            {
              type: "paragraph",
              html: "Every message has the same shape. Learn it and the compiler becomes helpful instead of scary."
            },
            {
              type: "code",
              language: "shell",
              label: "example",
              code: String.raw`negate.c:14:13: error: expected ';' before '}' token
   14 |     return 0
      |             ^`
            },
            {
              type: "paragraph",
              html: "That is <code>file : line : column : severity : message</code>, then the line and a caret pointing at the spot. Three rules: <strong>fix the first error first</strong> (later ones are often its echo), <strong>look at the line above too</strong> (a missing <code>;</code> is reported on the next line), and <strong>never silence warnings</strong>."
            },
            {
              type: "table",
              head: ["You see", "Likely cause", "Where to look"],
              rows: [
                [
                  "<code>expected ';' before ...</code>",
                  "A missing semicolon, usually on the previous line",
                  "The line the caret points at, and the one above"
                ],
                [
                  "<code>implicit declaration of function 'strtol'</code>",
                  "A missing <code>#include</code>",
                  "SYNOPSIS of <code>man 3 strtol</code>"
                ],
                [
                  "<code>format '%d' expects ... 'int', but argument has type 'long int'</code>",
                  "Wrong printf format for a <code>long</code>",
                  "Use <code>%ld</code>"
                ],
                [
                  "<code>undefined reference to ...</code>",
                  "The linker cannot find a function: misspelled name or missing library",
                  "Spelling; <code>man</code> page for a library flag"
                ],
                [
                  "<code>control reaches end of non-void function</code>",
                  "A function that should return a value does not on every path",
                  "Add the missing <code>return</code>"
                ],
                [
                  "<code>unused variable 'x'</code>",
                  "Declared and never used",
                  "Use it or delete it"
                ]
              ]
            },
            {
              type: "exercise",
              label: "Task: break it on purpose",
              blocks: [
                {
                  type: "paragraph",
                  html: "Copy a working file: <code>cp negate.c broken.c</code>. Make one change at a time, compile, read the message, then undo it."
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Delete a semicolon.",
                    "Delete the <code>#include</code> line that provides <code>strtol</code>.",
                    "Change a <code>%ld</code> to <code>%d</code>.",
                    "Misspell <code>printf</code> as <code>prinft</code>. Is it an error, a warning, or both? Which stage reports it?"
                  ]
                },
                {
                  type: "paragraph",
                  html: "Delete <code>broken.c</code> when you are done."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I have one command that builds all five programs with no warnings.",
                "I can read <code>file:line:column: severity: message</code> and fix the first error first.",
                "I broke a program on purpose four ways and understood each message."
              ]
            }
          ]
        },
        {
          id: "s4-3",
          no: "4.3",
          title: "Run it and prove it works",
          blocks: [
            {
              type: "heading",
              level: 4,
              html: "1. Children alone"
            },
            {
              type: "paragraph",
              html: "Re-run the test tables from 3.1 and 3.2 against the final builds. Each failing row must exit with status 1: check with <code>echo $?</code> straight after."
            },
            {
              type: "heading",
              level: 4,
              html: "2. The calculator, by hand"
            },
            {
              type: "table",
              head: ["You type at <code>calc&gt; </code>", "You must see"],
              rows: [
                [
                  "<code>add 2 3</code>",
                  "<code>Result: 5</code> then <code>child process exited successfully (PID n)</code>"
                ],
                ["<code>sub 4 10</code>", "<code>Result: -6</code> then the success line"],
                [
                  "<code>multiply -3 4</code>",
                  "<code>Result: -12</code> then the success line"
                ],
                ["<code>negate 8</code>", "<code>Result: -8</code> then the success line"],
                [
                  "<code>add 2 abc</code>",
                  "the child's error, then <code>child process exited unsuccessfully with status 1 (PID n)</code>"
                ],
                [
                  "<code>multiply 6</code>",
                  "<code>Operation cannot execute: multiply needs 2 argument(s), got 1</code>, no PID line"
                ],
                [
                  "<code>divide 4 2</code>",
                  "<code>Operation cannot execute: invalid operator \"divide\"</code>, no PID line"
                ],
                ["<code>exit</code>", "Back at the shell. <code>echo $?</code> prints 0"]
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "3. The calculator, automatically"
            },
            {
              type: "paragraph",
              html: "Typing tests by hand does not scale. Programs can read their input from a file instead of the keyboard. Create a file called <code>tests.txt</code> with a text editor containing these eight lines, one per line:"
            },
            {
              type: "code",
              language: "shell",
              label: "tests.txt",
              code: String.raw`add 2 3
sub 10 4
multiply 6 7
negate 5
add 2 abc
multiply 6
divide 4 2
exit`
            },
            {
              type: "paragraph",
              html: "Then run it with <code>&lt;</code>, which connects the file to the calculator's standard input:"
            },
            {
              type: "code",
              language: "shell",
              label: "terminal and expected output (PIDs differ)",
              code: String.raw`$ ./calculator < tests.txt
calc> Result: 5
child process exited successfully (PID 371)
calc> Result: 6
child process exited successfully (PID 372)
calc> Result: 42
child process exited successfully (PID 373)
calc> Result: -5
child process exited successfully (PID 374)
calc> ./add: invalid argument
child process exited unsuccessfully with status 1 (PID 375)
calc> Operation cannot execute: multiply needs 2 argument(s), got 1
calc> Operation cannot execute: invalid operator "divide"
calc> $ echo $?
0`
            },
            {
              type: "paragraph",
              html: "The prompts run together with the output because nobody is typing, so there is nothing echoed after each <code>calc&gt; </code>. Every line except the PIDs and the child's own error wording must match."
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "Make the test file prove something new: add a line for each of the three break-it cases you chose in 3.6, run it, and compare the output with what you decided <em>should</em> happen.",
                    "Try the pipe form: <code>printf 'add 2 3\\nexit\\n' | ./calculator</code>. In one sentence, how is <code>|</code> different from <code>&lt;</code>?"
                  ]
                },
                {
                  type: "hint",
                  summary: "Hint for 2",
                  blocks: [
                    {
                      type: "paragraph",
                      html: "<code>&lt;</code> feeds a <em>file</em> to a program. <code>|</code> feeds the <em>output of another program</em> to it."
                    }
                  ]
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "Every row in the hand-testing table behaves as specified.",
                "<code>./calculator &lt; tests.txt</code> matches the expected output apart from PIDs.",
                "I have extended <code>tests.txt</code> with cases of my own."
              ]
            }
          ]
        },
        {
          id: "s4-4",
          no: "4.4",
          title: "When something is wrong",
          blocks: [
            {
              type: "paragraph",
              html: "Everyone's program fails at some point. What separates people is the routine they follow next."
            },
            {
              type: "list",
              ordered: true,
              items: [
                "<strong>Make it small.</strong> Find the shortest input that still fails.",
                "<strong>Read the first message completely.</strong> Out loud, if needed. Most of the answer is in it.",
                "<strong>Test one layer at a time.</strong> Does the child work alone? Does the parent split the words right? Does the check pass? Only then suspect <code>fork</code>.",
                "<strong>Make the program tell you.</strong> Temporary <code>fprintf(stderr, ...)</code> lines showing the values you assumed. Delete them afterwards.",
                "<strong>Look it up.</strong> <code>man</code> for the function you doubt. Read RETURN VALUE and ERRORS.",
                "<strong>Ask well.</strong> If you still cannot see it, ask a person or an AI with the four things from the start of this guide: the exact command, the <em>complete</em> output, your code, and what you expected."
              ]
            },
            {
              type: "note",
              variant: "note",
              label: "See the system calls for real",
              blocks: [
                {
                  type: "paragraph",
                  html: "If <code>strace</code> is installed, you can watch the kernel calls your calculator makes. This is the “system call” idea from the first lesson of the course, made visible."
                },
                {
                  type: "code",
                  language: "shell",
                  label: "terminal (trimmed output)",
                  code: String.raw`$ printf 'add 2 3\nexit\n' | strace -f -e trace=process ./calculator
execve("./calculator", ["./calculator"], ...) = 0
clone(...) = 382
[pid   381] wait4(382,  <unfinished ...>
[pid   382] execve("./add", ["./add", "2", "3"], ...) = 0
[pid   382] exit_group(0)               = ?
<... wait4 resumed>[{WIFEXITED(s) && WEXITSTATUS(s) == 0}], 0, NULL) = 382`
                },
                {
                  type: "paragraph",
                  html: "Match each line to your code: <code>clone</code> is how <code>fork</code> appears on modern Linux, <code>execve</code> is the system call under <code>execv</code>, and <code>wait4</code> is under <code>waitpid</code>. The number returned by <code>clone</code> is the child's PID, and <code>wait4</code> waits for exactly that number."
                }
              ]
            },
            {
              type: "exercise",
              label: "Task",
              blocks: [
                {
                  type: "paragraph",
                  html: "Run your own calculator under <code>strace</code> and find, in the output: the line where the child is created, the line where it becomes <code>./add</code>, and the line where the parent's wait returns. Does the status in that last line agree with what the calculator printed?"
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Checkpoint",
              items: [
                "I can describe the debugging routine in my own words.",
                "I found <code>clone</code>, <code>execve</code> and <code>wait4</code> in a trace of my own program."
              ]
            }
          ]
        },
        {
          id: "s4-5",
          no: "4.5",
          title: "Finish line",
          blocks: [
            {
              type: "lede",
              html: "You have built something that contains a small version of what every shell does: read a line, split it into words, look up what to run, fork a child, exec the program in it, wait, and report the exit status. Your calculator is a tiny shell."
            },
            {
              type: "heading",
              level: 4,
              html: "Where each course topic showed up"
            },
            {
              type: "table",
              head: ["Topic", "Where you used it"],
              rows: [
                [
                  "Operating systems, system calls",
                  "The <code>strace</code> trace: <code>clone</code>, <code>execve</code>, <code>wait4</code>"
                ],
                [
                  "Terminal, shell, Bash",
                  "Everything you typed. The shell started <code>calculator</code> exactly the way <code>calculator</code> starts its children"
                ],
                [
                  "Basic Linux commands",
                  "Phase 1; and <code>mv</code>, <code>ls</code>, <code>man</code>, <code>file</code> throughout"
                ],
                ["Compiling C with GCC", "4.1 and 4.2"],
                ["Processes, PID, PPID", "2.1 and the process tree in 3.6"],
                [
                  "<code>fork</code>, <code>exec</code>, <code>waitpid</code>",
                  "Phase 2 and 3.5"
                ],
                [
                  "Return value of <code>main</code>",
                  "The children's exit status 0 or 1; read by the parent; <code>echo $?</code>"
                ],
                [
                  "Shell execution",
                  "<code>./add</code> instead of <code>add</code>; the same read-split-fork-exec-wait loop as a shell"
                ],
                [
                  "<code>argc</code> and <code>argv</code>",
                  "Every child, and the array you built for <code>execv</code>"
                ],
                [
                  "Environment variables, <code>PATH</code>",
                  "4.1: why <code>negate 5</code> was not found. The challenges below take it further"
                ]
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Final checklist"
            },
            {
              type: "checkpoint",
              title: null,
              items: [
                "All five programs compile with <code>-Wall -Wextra -std=c11</code> and no warnings.",
                "Every message from the blueprint table appears exactly, in the right situation.",
                "The prompt always returns after the child's output, with no stray or doubled lines.",
                "I can explain, from memory, the journey of the line <code>add 2 3</code> from keyboard to result."
              ]
            },
            {
              type: "heading",
              level: 4,
              html: "Challenges, when you want more"
            },
            {
              type: "list",
              ordered: false,
              items: [
                "<strong>Run children by name.</strong> Use <code>execvp</code> and add the project folder to <code>PATH</code> for your session with <code>export PATH=$PATH:$HOME/calc_project</code>. What changes? What else on your system just became easier to reach by mistake?",
                "<strong>A debug switch.</strong> Read the environment variable <code>CALC_DEBUG</code> with <code>getenv</code> (<code>man 3 getenv</code>). When it is set, print each word the parent found and the child's PPID from inside the child. Run it with <code>CALC_DEBUG=1 ./calculator</code>. Does the child see the variable? Why?",
                "<strong>A Makefile.</strong> Put your build command into a <code>Makefile</code> so <code>make</code> rebuilds only what changed. Start with <code>man make</code> and a search for “simple Makefile for C programs”.",
                "<strong>More operations.</strong> <code>divide</code>, <code>modulo</code>, <code>power</code>. Which of them has a way to fail that the others do not?",
                "<strong>Several at once.</strong> Let the user end a line with <code>&amp;</code> to run it in the background, like the shell does. What happens to the PID report? What must the parent do about children it did not wait for?"
              ]
            },
            {
              type: "note",
              variant: "story",
              label: "In the kitchen story",
              blocks: [
                {
                  type: "paragraph",
                  html: "You have built the whole kitchen: a manager who shares the stoves, a waiter who reads orders, a head cook who clones herself, and line cooks who each do one thing and report back. Nothing here was magic."
                }
              ]
            },
            {
              type: "checkpoint",
              title: "Phase 4 checkpoint",
              items: [
                "My calculator passes every test in this guide, and I can explain why each part is there."
              ]
            }
          ]
        }
      ]
    }
  ]
};
