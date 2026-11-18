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
      "id": "p3",
      "label": "Phase 3",
      "title": "Build the calculator",
      "lessons": [
        {
          "id": "p3-intro",
          "no": "",
          "title": "Overview",
          "blocks": [
            {
              "type": "lede",
              "html": "Now we build the real project. Instead of staring at a blank file, we will break the project into small, clear building blocks. Each step explains the concept first, shows you the partial code for that piece, and guides you through filling in the missing lines."
            },
            {
              "type": "note",
              "variant": "note",
              "label": "How Phase 3 is organised",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "We will start by looking at the big-picture workflow so you see how <code>calculator.c</code> talks to the four child programs. Then we will build the child programs (<code>negate.c</code>, <code>add.c</code>, <code>sub.c</code>, <code>multiply.c</code>) because they are short and share the exact same structure. Finally, we will build <code>calculator.c</code> in three guided stages: the interactive prompt, the input checker, and the <code>fork</code>/<code>exec</code>/<code>waitpid</code> launcher."
                }
              ]
            }
          ]
        },
        {
          "id": "s3-0",
          "no": "3.0",
          "title": "The blueprint & workflow",
          "blocks": [
            {
              "type": "lede",
              "html": "Before writing code, let's trace what happens from the moment you type a command at <code>calc&gt; </code> to the moment the result appears on screen."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "How the five files work together"
            },
            {
              "type": "paragraph",
              "html": "Your project folder <code>~/calc_project</code> has five C files. Each compiles into its own separate program:"
            },
            {
              "type": "table",
              "head": [
                "File",
                "Compiled program",
                "What it does",
                "How many numbers it needs"
              ],
              "rows": [
                [
                  "<code>calculator.c</code>",
                  "<code>./calculator</code>",
                  "The parent program: shows <code>calc&gt; </code>, reads your line, checks the operator &amp; argument count, and starts the right child process",
                  "None (reads from keyboard)"
                ],
                [
                  "<code>negate.c</code>",
                  "<code>./negate</code>",
                  "Takes 1 integer <code>A</code> and prints <code>Result: -A</code>",
                  "1"
                ],
                [
                  "<code>add.c</code>",
                  "<code>./add</code>",
                  "Takes 2 integers <code>A B</code> and prints <code>Result: A + B</code>",
                  "2"
                ],
                [
                  "<code>sub.c</code>",
                  "<code>./sub</code>",
                  "Takes 2 integers <code>A B</code> and prints <code>Result: A - B</code>",
                  "2"
                ],
                [
                  "<code>multiply.c</code>",
                  "<code>./multiply</code>",
                  "Takes 2 integers <code>A B</code> and prints <code>Result: A * B</code>",
                  "2"
                ]
              ]
            },
            {
              "type": "figure",
              "svg": "<svg aria-label=\"Workflow: the parent reads and checks a line, forks, and waits; the child execs a program that exits with a status the parent reports\" role=\"img\" viewbox=\"0 0 760 410\">\n<defs><marker id=\"ah2\" markerheight=\"7\" markerwidth=\"7\" orient=\"auto-start-reverse\" refx=\"9\" refy=\"5\" viewbox=\"0 0 10 10\"><path d=\"M0 0L10 5L0 10z\" fill=\"var(--muted)\"></path></marker></defs>\n<rect class=\"sv-lane\" height=\"392\" rx=\"10\" width=\"380\" x=\"24\" y=\"8\"></rect>\n<rect class=\"sv-lane\" height=\"392\" rx=\"10\" width=\"284\" x=\"458\" y=\"8\"></rect>\n<text class=\"sv-h\" x=\"40\" y=\"28\">Parent: calculator.c</text>\n<text class=\"sv-h\" x=\"474\" y=\"28\">Child: starts as a copy</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"40\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"62\">1. Read a line</text><text class=\"sv-s\" x=\"50\" y=\"80\">show calc&gt;, read input with fgets, split into words</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"106\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"128\">2. Check operator &amp; count</text><text class=\"sv-s\" x=\"50\" y=\"146\">if invalid operator or wrong count: print error &amp; loop</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"172\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"194\">3. fork()</text><text class=\"sv-s\" x=\"50\" y=\"212\">parent gets child's PID; child gets 0</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"238\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"260\">4. waitpid(pid, &amp;status, 0)</text><text class=\"sv-s\" x=\"50\" y=\"278\">parent pauses until the child finishes</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"356\" x=\"36\" y=\"304\"></rect>\n<text class=\"sv-t\" x=\"50\" y=\"326\">5. Report exit status</text><text class=\"sv-s\" x=\"50\" y=\"344\">print whether child exited successfully (with PID)</text>\n<path class=\"sv-line\" d=\"M214 90V106\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 156V172\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 222V238\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 288V304\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M214 354V378H10V65H34\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-s\" x=\"224\" y=\"372\">loop back to calc&gt;</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"172\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"194\">Child begins (pid == 0)</text><text class=\"sv-s\" x=\"486\" y=\"212\">builds path like \"./add\"</text>\n<rect class=\"sv-box hi\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"238\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"260\">execv(\"./add\", tokens)</text><text class=\"sv-s\" x=\"486\" y=\"278\">turns into the add program</text>\n<rect class=\"sv-box\" height=\"50\" rx=\"8\" width=\"256\" x=\"472\" y=\"304\"></rect>\n<text class=\"sv-t\" x=\"486\" y=\"326\">add.c main() runs</text><text class=\"sv-s\" x=\"486\" y=\"344\">checks numbers, prints Result, returns 0 or 1</text>\n<path class=\"sv-line\" d=\"M392 197H470\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-a\" text-anchor=\"middle\" x=\"431\" y=\"189\">fork</text>\n<path class=\"sv-line\" d=\"M600 222V238\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line\" d=\"M600 288V304\" marker-end=\"url(#ah2)\"></path>\n<path class=\"sv-line dash\" d=\"M472 329H394\" marker-end=\"url(#ah2)\"></path>\n<text class=\"sv-s\" text-anchor=\"middle\" x=\"433\" y=\"321\">exit status (0 or 1)</text>\n</svg>",
              "caption": "The step-by-step lifecycle of a single command in your calculator."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Who checks what? (The division of labor)"
            },
            {
              "type": "paragraph",
              "html": "One of the most common points of confusion is knowing what goes in <code>calculator.c</code> versus what goes in <code>add.c</code>, <code>sub.c</code>, <code>multiply.c</code>, and <code>negate.c</code>. Here is the exact rule:"
            },
            {
              "type": "list",
              "ordered": true,
              "items": [
                "<strong>The parent (<code>calculator.c</code>) checks the command shape before forking:</strong> Is the first word one of <code>add</code>, <code>sub</code>, <code>multiply</code>, or <code>negate</code>? And did the user type the right number of arguments after it (2 for <code>add</code>/<code>sub</code>/<code>multiply</code>, 1 for <code>negate</code>)? If not, the parent prints an error right away and <strong>does not fork</strong>.",
                "<strong>The child (<code>add.c</code>, etc.) checks if the arguments are valid integers:</strong> Once the child starts, it checks that the text strings it received (like <code>\"2\"</code> and <code>\"3\"</code>, or <code>\"abc\"</code>) are actually valid integers. If they are valid, it prints <code>Result: ...</code> and returns <code>0</code>. If an argument is not a valid number (like <code>\"abc\"</code>), it prints an error and returns <code>1</code>.",
                "<strong>The parent reports how the child finished:</strong> After <code>waitpid</code> finishes, the parent checks the child's exit status. If status is <code>0</code>, it prints that the child exited successfully. Otherwise, it prints that the child exited unsuccessfully."
              ]
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Exact messages your parent program will print"
            },
            {
              "type": "table",
              "head": [
                "When this happens",
                "calculator.c prints"
              ],
              "rows": [
                [
                  "Unknown operator (e.g. <code>divide 4 2</code>)",
                  "<code>Operation cannot execute: invalid operator \"divide\"</code>"
                ],
                [
                  "Wrong argument count (e.g. <code>multiply 6</code>)",
                  "<code>Operation cannot execute: multiply needs 2 argument(s), got 1</code>"
                ],
                [
                  "Child returns 0 (success)",
                  "<code>child process exited successfully (PID 4243)</code>"
                ],
                [
                  "Child returns N != 0 (e.g. bad number)",
                  "<code>child process exited unsuccessfully with status 1 (PID 4243)</code>"
                ],
                [
                  "Child killed by a signal",
                  "<code>child process failed: killed by signal N (PID 4243)</code>"
                ]
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "I understand why there are 5 separate C files and what each one compiles into.",
                "I know that <code>calculator.c</code> checks the operator name and count, while the child programs check whether the arguments are valid numbers and do the math."
              ]
            }
          ]
        },
        {
          "id": "s3-1",
          "no": "3.1",
          "title": "negate.c: step-by-step child program",
          "blocks": [
            {
              "type": "lede",
              "html": "Let's build <code>negate.c</code> first. It only takes <strong>one</strong> number and prints its negative (for example, <code>./negate 5</code> prints <code>Result: -5</code>). Once you understand <code>negate.c</code>, writing the other three child programs will be easy."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 1: How a C program receives command-line arguments"
            },
            {
              "type": "paragraph",
              "html": "When you run a program in the terminal\u2014or when <code>calculator</code> starts a child with <code>execv</code>\u2014the words of the command are passed into <code>main</code> using two parameters: <code>argc</code> (argument count) and <code>argv</code> (argument values, an array of strings)."
            },
            {
              "type": "code",
              "language": "c",
              "label": "how main receives arguments",
              "code": "int main(int argc, char *argv[])"
            },
            {
              "type": "paragraph",
              "html": "If someone runs <code>./negate 5</code>, here is what <code>argc</code> and <code>argv</code> hold:"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "<code>argc</code> is <code>2</code> (because there are 2 words total on the command line).",
                "<code>argv[0]</code> is <code>\"./negate\"</code> (the program name itself is always slot 0).",
                "<code>argv[1]</code> is <code>\"5\"</code> (the first actual argument, stored as text!).",
                "<code>argv[2]</code> is <code>NULL</code> (marks the end of the array)."
              ]
            },
            {
              "type": "paragraph",
              "html": "So if <code>negate</code> needs 1 number, <code>argc</code> <strong>must be 2</strong>. Here is the partial code for checking <code>argc</code>:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "checking argument count in negate.c",
              "code": "if (argc != 2) {\n    fprintf(stderr, \"%s: usage: %s <number>\\n\", argv[0], argv[0]);\n    return 1;\n}"
            },
            {
              "type": "note",
              "variant": "note",
              "label": "Why fprintf(stderr, ...) and return 1?",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "<code>fprintf(stderr, ...)</code> works just like <code>printf(...)</code>, except it sends the text to the <strong>standard error</strong> stream. Returning <code>1</code> from <code>main</code> tells the parent process that this child failed."
                }
              ]
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 2: Converting a string like \"5\" into a number (and catching \"abc\")"
            },
            {
              "type": "paragraph",
              "html": "Right now <code>argv[1]</code> is a string of characters (<code>\"5\"</code>), not a number you can do math on. Why not use <code>atoi(argv[1])</code>? Because if the user types <code>./negate abc</code>, <code>atoi(\"abc\")</code> silently returns <code>0</code>\u2014it can't tell the difference between <code>\"0\"</code> and garbage!"
            },
            {
              "type": "paragraph",
              "html": "Instead, C gives us <code>strtol</code> (string-to-long, in <code>&lt;stdlib.h&gt;</code>). Let's see how it works in 4 lines of code:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "how strtol converts and checks a string",
              "code": "char *end;\nlong a = strtol(argv[1], &end, 10);"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "<code>argv[1]</code> is the string we want to convert.",
                "<code>&amp;end</code> gives <code>strtol</code> the address of a character pointer. When <code>strtol</code> finishes reading digits, it makes <code>end</code> point to the <strong>first character it could not convert</strong>.",
                "<code>10</code> means base-10 (normal decimal numbers)."
              ]
            },
            {
              "type": "paragraph",
              "html": "Look at what <code>end</code> points to in three different cases:"
            },
            {
              "type": "table",
              "head": [
                "Input string",
                "What strtol reads",
                "What *end is afterwards",
                "Valid?"
              ],
              "rows": [
                [
                  "<code>\"42\"</code>",
                  "Reads <code>42</code>",
                  "<code>'\\0'</code> (the end-of-string null byte)",
                  "<strong>Yes!</strong> It reached the end of the string."
                ],
                [
                  "<code>\"12abc\"</code>",
                  "Reads <code>12</code>, stops at <code>a</code>",
                  "<code>'a'</code> (not <code>'\\0'</code>)",
                  "<strong>No!</strong> Leftover letters at the end."
                ],
                [
                  "<code>\"abc\"</code>",
                  "Reads no digits at all",
                  "<code>end == argv[1]</code> (never moved)",
                  "<strong>No!</strong> Nothing was converted."
                ]
              ]
            },
            {
              "type": "paragraph",
              "html": "Also, if someone types a huge number that doesn't fit in a <code>long</code> (like <code>99999999999999999999</code>), <code>strtol</code> sets the global variable <code>errno</code> (from <code>&lt;errno.h&gt;</code>) to <code>ERANGE</code>. Putting that together gives us a clean, reusable check:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "complete number conversion check",
              "code": "char *end;\nerrno = 0;\nlong a = strtol(argv[1], &end, 10);\n\nif (errno == ERANGE || end == argv[1] || *end != '\\0') {\n    fprintf(stderr, \"%s: invalid argument\\n\", argv[0]);\n    return 1;\n}"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 3: Put negate.c together"
            },
            {
              "type": "exercise",
              "label": "Task: write and test negate.c",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "Open <code>~/calc_project/negate.c</code> and type in this guided structure. Fill in the 3 short <code>TODO</code> lines using the code blocks above:"
                },
                {
                  "type": "code",
                  "language": "c",
                  "label": "negate.c (guided template)",
                  "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n\nint main(int argc, char *argv[]) {\n    /* 1. Check that the user passed 1 argument (so argc is 2) */\n    if (argc != 2) {\n        fprintf(stderr, \"%s: usage: %s <number>\\n\", argv[0], argv[0]);\n        return 1;\n    }\n\n    /* 2. Convert argv[1] to a long and check for invalid input */\n    char *end;\n    errno = 0;\n    long a = strtol(argv[1], &end, 10);\n\n    if (/* TODO: check if errno == ERANGE, or end == argv[1], or *end != '\\0' */) {\n        fprintf(stderr, \"%s: invalid argument\\n\", argv[0]);\n        return 1;\n    }\n\n    /* 3. Print the negated number and return 0 for success */\n    /* TODO: use printf(\"Result: %ld\\n\", -a); */\n    /* TODO: return 0; */\n}"
                },
                {
                  "type": "paragraph",
                  "html": "Now compile and test it directly in your terminal before moving on:"
                },
                {
                  "type": "code",
                  "language": "shell",
                  "label": "compile and test negate",
                  "code": "$ gcc -Wall -Wextra -o negate negate.c\n$ ./negate 5\nResult: -5\n$ echo $?\n0\n$ ./negate -12\nResult: 12\n$ ./negate abc\n./negate: invalid argument\n$ echo $?\n1"
                },
                {
                  "type": "hint",
                  "summary": "Full solution check for negate.c (open if stuck)",
                  "blocks": [
                    {
                      "type": "paragraph",
                      "html": "Your <code>if</code> condition is <code>if (errno == ERANGE || end == argv[1] || *end != '\\0')</code>, and the last two lines of <code>main</code> are <code>printf(\"Result: %ld\\n\", -a);</code> followed by <code>return 0;</code>."
                    }
                  ]
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "<code>negate.c</code> compiles with no warnings.",
                "<code>./negate 5</code> prints <code>Result: -5</code> and <code>echo $?</code> prints <code>0</code>.",
                "<code>./negate abc</code> prints an error to <code>stderr</code> and <code>echo $?</code> prints <code>1</code>."
              ]
            }
          ]
        },
        {
          "id": "s3-2",
          "no": "3.2",
          "title": "add.c, sub.c and multiply.c",
          "blocks": [
            {
              "type": "lede",
              "html": "Now we build the three two-number programs: <code>add.c</code>, <code>sub.c</code>, and <code>multiply.c</code>. They are almost identical to <code>negate.c</code>\u2014the only difference is that they take <strong>two</strong> numbers instead of one."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Using a small helper function so we don't repeat ourselves"
            },
            {
              "type": "paragraph",
              "html": "In <code>add.c</code>, we have to convert <strong>both</strong> <code>argv[1]</code> and <code>argv[2]</code> using <code>strtol</code>. Instead of pasting the <code>strtol</code> check twice, we can put it in a tiny helper function right above <code>main</code>:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "the parse_long helper function",
              "code": "/* Converts `text` into a long and stores it in `*out`.\n   Returns 0 on success, or -1 if `text` is not a valid integer. */\nstatic int parse_long(const char *text, long *out) {\n    char *end;\n    errno = 0;\n    long val = strtol(text, &end, 10);\n    if (errno == ERANGE || end == text || *end != '\\0') {\n        return -1;\n    }\n    *out = val;\n    return 0;\n}"
            },
            {
              "type": "paragraph",
              "html": "Look at how clean <code>main</code> becomes when we use <code>parse_long</code>: we just pass <code>argv[1]</code> with <code>&amp;a</code>, and <code>argv[2]</code> with <code>&amp;b</code>!"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Guided template for add.c"
            },
            {
              "type": "exercise",
              "label": "Task: build add.c, then adapt it for sub.c and multiply.c",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "1. Open <code>~/calc_project/add.c</code> and complete the guided code below:"
                },
                {
                  "type": "code",
                  "language": "c",
                  "label": "add.c (guided template)",
                  "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n\nstatic int parse_long(const char *text, long *out) {\n    char *end;\n    errno = 0;\n    long val = strtol(text, &end, 10);\n    if (errno == ERANGE || end == text || *end != '\\0') {\n        return -1;\n    }\n    *out = val;\n    return 0;\n}\n\nint main(int argc, char *argv[]) {\n    /* 1. add needs 2 numbers, so argc must be 3 (program name + 2 args) */\n    if (argc != 3) {\n        fprintf(stderr, \"%s: usage: %s <a> <b>\\n\", argv[0], argv[0]);\n        return 1;\n    }\n\n    /* 2. Convert both argv[1] and argv[2] using parse_long */\n    long a, b;\n    if (parse_long(argv[1], &a) != 0 || parse_long(argv[2], &b) != 0) {\n        fprintf(stderr, \"%s: invalid argument\\n\", argv[0]);\n        return 1;\n    }\n\n    /* 3. Print the sum and return 0 */\n    /* TODO: print \"Result: %ld\\n\" with a + b */\n    return 0;\n}"
                },
                {
                  "type": "paragraph",
                  "html": "2. Once <code>add.c</code> is done, copy its structure into <code>sub.c</code> and <code>multiply.c</code>. The <strong>only</strong> thing that changes in <code>sub.c</code> and <code>multiply.c</code> is the arithmetic operator inside <code>printf</code>:"
                },
                {
                  "type": "table",
                  "head": [
                    "File",
                    "printf line in main"
                  ],
                  "rows": [
                    [
                      "<code>add.c</code>",
                      "<code>printf(\"Result: %ld\\n\", a + b);</code>"
                    ],
                    [
                      "<code>sub.c</code>",
                      "<code>printf(\"Result: %ld\\n\", a - b);</code>"
                    ],
                    [
                      "<code>multiply.c</code>",
                      "<code>printf(\"Result: %ld\\n\", a * b);</code>"
                    ]
                  ]
                },
                {
                  "type": "paragraph",
                  "html": "3. Compile and test all three in your terminal:"
                },
                {
                  "type": "code",
                  "language": "shell",
                  "label": "compile and test the children",
                  "code": "$ gcc -Wall -Wextra -o add add.c\n$ gcc -Wall -Wextra -o sub sub.c\n$ gcc -Wall -Wextra -o multiply multiply.c\n$ ./add 2 3\nResult: 5\n$ ./sub 10 4\nResult: 6\n$ ./multiply 6 7\nResult: 42\n$ ./add 2 abc\n./add: invalid argument\n$ echo $?\n1"
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "<code>add</code>, <code>sub</code>, and <code>multiply</code> all compile cleanly with <code>-Wall -Wextra</code>.",
                "All four child programs (<code>add</code>, <code>sub</code>, <code>multiply</code>, <code>negate</code>) work when run directly from the terminal and return exit status <code>1</code> on bad input."
              ]
            }
          ]
        },
        {
          "id": "s3-3",
          "no": "3.3",
          "title": "calculator.c Part A: the prompt & splitting words",
          "blocks": [
            {
              "type": "lede",
              "html": "All four child programs are ready! Now we start building the parent program, <code>calculator.c</code>. In Part A, we will make it display the <code>calc&gt; </code> prompt in a loop, read a line from the user, and split that line into an array of words."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 1: Printing the prompt and reading a line with fgets"
            },
            {
              "type": "paragraph",
              "html": "Just like the Python interactive shell, our calculator runs inside a <code>while (1)</code> loop. Every turn of the loop:"
            },
            {
              "type": "list",
              "ordered": true,
              "items": [
                "We print <code>calc&gt; </code> (without a <code>\\n</code> so the user types on the same line) and call <code>fflush(stdout)</code> so the prompt appears on screen immediately.",
                "We read a full line of text from the keyboard using <code>fgets(line, sizeof line, stdin)</code>.",
                "If the user presses <kbd>Ctrl</kbd>+<kbd>D</kbd> (end-of-file), <code>fgets</code> returns <code>NULL</code>, so we print a newline and <code>break</code> out of the loop."
              ]
            },
            {
              "type": "code",
              "language": "c",
              "label": "printing the prompt and reading a line",
              "code": "char line[256];\n\nwhile (1) {\n    printf(\"calc> \");\n    fflush(stdout);\n\n    if (fgets(line, sizeof line, stdin) == NULL) {\n        printf(\"\\n\");\n        break;\n    }\n    /* ... next we split `line` into words ... */\n}"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 2: Splitting the line into words with strtok"
            },
            {
              "type": "paragraph",
              "html": "When the user types <code>add 2 3</code> and presses Enter, <code>line</code> holds the single string <code>\"add 2 3\\n\"</code>. We need to break that string into individual words stored in an array called <code>tokens</code>:"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "<code>tokens[0]</code> &rarr; <code>\"add\"</code>",
                "<code>tokens[1]</code> &rarr; <code>\"2\"</code>",
                "<code>tokens[2]</code> &rarr; <code>\"3\"</code>",
                "<code>tokens[3]</code> &rarr; <code>NULL</code>"
              ]
            },
            {
              "type": "paragraph",
              "html": "C provides <code>strtok</code> (in <code>&lt;string.h&gt;</code>) to split a string at spaces, tabs, and newlines (<code>\" \\t\\n\"</code>):"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "On the <strong>first call</strong>, you pass <code>line</code>: <code>strtok(line, \" \\t\\n\")</code> returns a pointer to the first word.",
                "On <strong>every call after that</strong>, you pass <code>NULL</code>: <code>strtok(NULL, \" \\t\\n\")</code> continues from where it left off and returns the next word, until there are no words left (when it returns <code>NULL</code>)."
              ]
            },
            {
              "type": "code",
              "language": "c",
              "label": "splitting line into tokens[] using strtok",
              "code": "char *tokens[17];   /* room for up to 16 words + 1 final NULL */\nint ntokens = 0;\n\nchar *word = strtok(line, \" \\t\\n\");\nwhile (word != NULL && ntokens < 16) {\n    tokens[ntokens] = word;\n    ntokens++;\n    word = strtok(NULL, \" \\t\\n\");\n}\ntokens[ntokens] = NULL;"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 3: Handling blank lines and \"exit\" / \"quit\""
            },
            {
              "type": "paragraph",
              "html": "What if the user just pressed Enter on an empty line? Then <code>ntokens == 0</code>, and we should use <code>continue;</code> to jump straight to the next prompt. And what if the first word (<code>tokens[0]</code>) is <code>\"exit\"</code> or <code>\"quit\"</code>? In C, you compare strings with <code>strcmp(a, b) == 0</code> (never <code>==</code>):"
            },
            {
              "type": "code",
              "language": "c",
              "label": "checking for empty line or exit/quit",
              "code": "if (ntokens == 0) {\n    continue;   /* empty line: show prompt again */\n}\nif (strcmp(tokens[0], \"exit\") == 0 || strcmp(tokens[0], \"quit\") == 0) {\n    break;      /* leave the while loop and end program */\n}"
            },
            {
              "type": "exercise",
              "label": "Task: write and test calculator.c (Part A)",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "Open <code>~/calc_project/calculator.c</code> and put Part A together. At the bottom of the loop, we temporarily print the words so we can verify our splitter works:"
                },
                {
                  "type": "code",
                  "language": "c",
                  "label": "calculator.c (Part A guided code)",
                  "code": "#include <stdio.h>\n#include <string.h>\n\n#define MAX_LINE   256\n#define MAX_TOKENS 16\n\nint main(void) {\n    char line[MAX_LINE];\n\n    while (1) {\n        printf(\"calc> \");\n        fflush(stdout);\n\n        if (fgets(line, sizeof line, stdin) == NULL) {\n            printf(\"\\n\");\n            break;\n        }\n\n        char *tokens[MAX_TOKENS + 1];\n        int ntokens = 0;\n\n        char *word = strtok(line, \" \\t\\n\");\n        while (word != NULL && ntokens < MAX_TOKENS) {\n            tokens[ntokens] = word;\n            ntokens++;\n            word = strtok(NULL, \" \\t\\n\");\n        }\n        tokens[ntokens] = NULL;\n\n        /* TODO 1: if ntokens == 0, continue to the next prompt */\n\n        /* TODO 2: if tokens[0] is \"exit\" or \"quit\" (use strcmp), break */\n\n        /* Temporary test print: show each word we found */\n        for (int i = 0; i < ntokens; i++) {\n            printf(\"word[%d] = %s\\n\", i, tokens[i]);\n        }\n    }\n    return 0;\n}"
                },
                {
                  "type": "paragraph",
                  "html": "Compile and run it to verify that words are split properly and <code>exit</code> quits:"
                },
                {
                  "type": "code",
                  "language": "shell",
                  "label": "testing Part A",
                  "code": "$ gcc -Wall -Wextra -o calculator calculator.c\n$ ./calculator\ncalc> add 2 3\nword[0] = add\nword[1] = 2\nword[2] = 3\ncalc> exit\n$"
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "<code>calculator.c</code> shows <code>calc&gt; </code>, splits words cleanly even with extra spaces, ignores blank lines, and exits on <code>exit</code>, <code>quit</code>, or <kbd>Ctrl</kbd>+<kbd>D</kbd>."
              ]
            }
          ]
        },
        {
          "id": "s3-4",
          "no": "3.4",
          "title": "calculator.c Part B: checking operator & argument count",
          "blocks": [
            {
              "type": "lede",
              "html": "Before <code>calculator.c</code> creates any child process, it must check two things: is the operator valid (<code>add</code>, <code>sub</code>, <code>multiply</code>, or <code>negate</code>), and did the user give the right number of arguments for that operator?"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 1: Deciding how many arguments an operator needs"
            },
            {
              "type": "paragraph",
              "html": "Let's keep this simple and direct. Given <code>tokens[0]</code> (the operator word the user typed), we can check which operator it is and set a variable <code>expected_args</code>:"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "If <code>tokens[0]</code> is <code>\"add\"</code>, <code>\"sub\"</code>, or <code>\"multiply\"</code> &rarr; <code>expected_args = 2</code>.",
                "Else if <code>tokens[0]</code> is <code>\"negate\"</code> &rarr; <code>expected_args = 1</code>.",
                "Else &rarr; it is not a valid operator! Print the invalid operator message and <code>continue;</code> back to the prompt."
              ]
            },
            {
              "type": "code",
              "language": "c",
              "label": "checking the operator name",
              "code": "int expected_args = 0;\n\nif (strcmp(tokens[0], \"add\") == 0 ||\n    strcmp(tokens[0], \"sub\") == 0 ||\n    strcmp(tokens[0], \"multiply\") == 0) {\n    expected_args = 2;\n} else if (strcmp(tokens[0], \"negate\") == 0) {\n    expected_args = 1;\n} else {\n    printf(\"Operation cannot execute: invalid operator \\\"%s\\\"\\n\", tokens[0]);\n    continue;\n}"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 2: Checking the number of arguments"
            },
            {
              "type": "paragraph",
              "html": "If <code>ntokens</code> is the total number of words on the line (including the operator at <code>tokens[0]</code>), then the number of arguments the user supplied after the operator is <code>ntokens - 1</code>."
            },
            {
              "type": "paragraph",
              "html": "For example, in <code>add 2 3</code>, <code>ntokens</code> is <code>3</code>, so the user gave <code>3 - 1 = 2</code> arguments. If <code>got_args != expected_args</code>, we print the exact error message from the blueprint and <code>continue;</code>:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "checking the argument count",
              "code": "int got_args = ntokens - 1;\nif (got_args != expected_args) {\n    printf(\"Operation cannot execute: %s needs %d argument(s), got %d\\n\",\n           tokens[0], expected_args, got_args);\n    continue;\n}"
            },
            {
              "type": "exercise",
              "label": "Task: add Part B to calculator.c and test it",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "Replace the temporary word-printing loop in <code>calculator.c</code> with the operator check and argument-count check above, followed by a temporary confirmation line:"
                },
                {
                  "type": "code",
                  "language": "c",
                  "label": "inside the while (1) loop of calculator.c",
                  "code": "        /* Check 1: Is tokens[0] a valid operator? */\n        int expected_args = 0;\n        if (strcmp(tokens[0], \"add\") == 0 ||\n            strcmp(tokens[0], \"sub\") == 0 ||\n            strcmp(tokens[0], \"multiply\") == 0) {\n            expected_args = 2;\n        } else if (strcmp(tokens[0], \"negate\") == 0) {\n            expected_args = 1;\n        } else {\n            printf(\"Operation cannot execute: invalid operator \\\"%s\\\"\\n\", tokens[0]);\n            continue;\n        }\n\n        /* Check 2: Did the user supply the right number of arguments? */\n        int got_args = ntokens - 1;\n        if (got_args != expected_args) {\n            /* TODO: print \"Operation cannot execute: %s needs %d argument(s), got %d\\n\"\n               and then continue; */\n        }\n\n        /* Temporary confirmation until Part C */\n        printf(\"OK: ready to run %s\\n\", tokens[0]);"
                },
                {
                  "type": "paragraph",
                  "html": "Compile and test these cases before moving to Part C:"
                },
                {
                  "type": "code",
                  "language": "shell",
                  "label": "testing Part B",
                  "code": "$ gcc -Wall -Wextra -o calculator calculator.c\n$ ./calculator\ncalc> add 2 3\nOK: ready to run add\ncalc> multiply 6\nOperation cannot execute: multiply needs 2 argument(s), got 1\ncalc> divide 4 2\nOperation cannot execute: invalid operator \"divide\"\ncalc> exit"
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "Invalid operators print <code>Operation cannot execute: invalid operator \"...\"</code>.",
                "Wrong argument counts print <code>Operation cannot execute: &lt;op&gt; needs N argument(s), got M</code>."
              ]
            }
          ]
        },
        {
          "id": "s3-5",
          "no": "3.5",
          "title": "calculator.c Part C: fork, execv and waitpid",
          "blocks": [
            {
              "type": "lede",
              "html": "Now for the final piece of <code>calculator.c</code>: when a command passes the checks in Part B, we fork a child process, use <code>execv</code> in the child to run <code>./add</code> (or <code>./sub</code>, <code>./multiply</code>, <code>./negate</code>), and use <code>waitpid</code> in the parent to wait for it and report its exit status."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 1: Building the program path (\"./add\") and argument list"
            },
            {
              "type": "paragraph",
              "html": "Remember from Phase 1 &amp; 2 that your compiled child programs live in the current directory (<code>.</code>), so to run <code>add</code> we must pass the path <code>\"./add\"</code> to <code>execv</code>."
            },
            {
              "type": "paragraph",
              "html": "We can build that path string using <code>snprintf</code>, which works just like <code>printf</code> but writes into a <code>char</code> array:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "building the path string",
              "code": "char path[64];\nsnprintf(path, sizeof path, \"./%s\", tokens[0]);"
            },
            {
              "type": "paragraph",
              "html": "And what array of arguments does <code>execv(path, tokens)</code> need? Look at what <code>tokens</code> already contains when the user types <code>add 2 3</code>:"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "<code>tokens[0]</code> is <code>\"add\"</code> &rarr; if we set <code>tokens[0] = path;</code> it becomes <code>\"./add\"</code>",
                "<code>tokens[1]</code> is <code>\"2\"</code>",
                "<code>tokens[2]</code> is <code>\"3\"</code>",
                "<code>tokens[3]</code> is <code>NULL</code> (which we already set at the end of our <code>strtok</code> loop!)"
              ]
            },
            {
              "type": "paragraph",
              "html": "That means <code>tokens</code> is <strong>already</strong> in the exact format <code>execv</code> needs!"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 2: Forking and running execv in the child"
            },
            {
              "type": "paragraph",
              "html": "Just like in Phase 2, we add <code>#include &lt;unistd.h&gt;</code> and <code>#include &lt;sys/wait.h&gt;</code> at the top of <code>calculator.c</code>, flush <code>stdout</code>, and call <code>fork()</code>:"
            },
            {
              "type": "code",
              "language": "c",
              "label": "fork and execv",
              "code": "fflush(stdout);\npid_t pid = fork();\nif (pid < 0) {\n    perror(\"fork\");\n    continue;\n}\nif (pid == 0) {\n    /* Child process: swap into ./add, ./sub, ./multiply, or ./negate */\n    tokens[0] = path;\n    execv(path, tokens);\n    /* If execv returns, starting the program failed! */\n    perror(path);\n    _exit(127);\n}"
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Step 3: Waiting in the parent and reporting the exit status"
            },
            {
              "type": "paragraph",
              "html": "While the child runs, the parent calls <code>waitpid(pid, &amp;status, 0)</code> so it pauses until the child finishes. Then the parent inspects <code>status</code> using the macros from <code>&lt;sys/wait.h&gt;</code>:"
            },
            {
              "type": "list",
              "ordered": false,
              "items": [
                "<code>WIFEXITED(status)</code> is true if the child exited normally (via <code>return</code> or <code>exit</code>).",
                "<code>WEXITSTATUS(status)</code> gives the number the child returned (<code>0</code> for success, <code>1</code> for invalid number).",
                "<code>WIFSIGNALED(status)</code> is true if the child was killed by a signal, and <code>WTERMSIG(status)</code> gives the signal number."
              ]
            },
            {
              "type": "code",
              "language": "c",
              "label": "waiting and reporting in the parent",
              "code": "int status;\nif (waitpid(pid, &status, 0) < 0) {\n    perror(\"waitpid\");\n    continue;\n}\n\nif (WIFEXITED(status)) {\n    int code = WEXITSTATUS(status);\n    if (code == 0) {\n        printf(\"child process exited successfully (PID %d)\\n\", pid);\n    } else {\n        printf(\"child process exited unsuccessfully with status %d (PID %d)\\n\",\n               code, pid);\n    }\n} else if (WIFSIGNALED(status)) {\n    printf(\"child process failed: killed by signal %d (PID %d)\\n\",\n           WTERMSIG(status), pid);\n}"
            },
            {
              "type": "exercise",
              "label": "Task: complete calculator.c and run the full system",
              "blocks": [
                {
                  "type": "paragraph",
                  "html": "Here is the complete guided structure of <code>calculator.c</code> with all three parts (A, B, and C) combined. Fill in the remaining <code>TODO</code> lines and compile:"
                },
                {
                  "type": "code",
                  "language": "c",
                  "label": "calculator.c (full guided file)",
                  "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\n#define MAX_LINE   256\n#define MAX_TOKENS 16\n\nint main(void) {\n    char line[MAX_LINE];\n\n    while (1) {\n        /* --- Part A: prompt and split line into words --- */\n        printf(\"calc> \");\n        fflush(stdout);\n\n        if (fgets(line, sizeof line, stdin) == NULL) {\n            printf(\"\\n\");\n            break;\n        }\n\n        char *tokens[MAX_TOKENS + 1];\n        int ntokens = 0;\n        char *word = strtok(line, \" \\t\\n\");\n        while (word != NULL && ntokens < MAX_TOKENS) {\n            tokens[ntokens++] = word;\n            word = strtok(NULL, \" \\t\\n\");\n        }\n        tokens[ntokens] = NULL;\n\n        if (ntokens == 0) {\n            continue;\n        }\n        if (strcmp(tokens[0], \"exit\") == 0 || strcmp(tokens[0], \"quit\") == 0) {\n            break;\n        }\n\n        /* --- Part B: check operator name and argument count --- */\n        int expected_args = 0;\n        if (strcmp(tokens[0], \"add\") == 0 ||\n            strcmp(tokens[0], \"sub\") == 0 ||\n            strcmp(tokens[0], \"multiply\") == 0) {\n            expected_args = 2;\n        } else if (strcmp(tokens[0], \"negate\") == 0) {\n            expected_args = 1;\n        } else {\n            printf(\"Operation cannot execute: invalid operator \\\"%s\\\"\\n\", tokens[0]);\n            continue;\n        }\n\n        int got_args = ntokens - 1;\n        if (got_args != expected_args) {\n            printf(\"Operation cannot execute: %s needs %d argument(s), got %d\\n\",\n                   tokens[0], expected_args, got_args);\n            continue;\n        }\n\n        /* --- Part C: fork, execv the child program, and waitpid --- */\n        char path[64];\n        snprintf(path, sizeof path, \"./%s\", tokens[0]);\n\n        fflush(stdout);\n        pid_t pid = fork();\n        if (pid < 0) {\n            perror(\"fork\");\n            continue;\n        }\n        if (pid == 0) {\n            tokens[0] = path;\n            /* TODO 1: call execv(path, tokens); */\n            perror(path);\n            _exit(127);\n        }\n\n        int status;\n        /* TODO 2: call waitpid(pid, &status, 0) and check for < 0 */\n\n        if (WIFEXITED(status)) {\n            int code = WEXITSTATUS(status);\n            if (code == 0) {\n                printf(\"child process exited successfully (PID %d)\\n\", pid);\n            } else {\n                printf(\"child process exited unsuccessfully with status %d (PID %d)\\n\",\n                       code, pid);\n            }\n        } else if (WIFSIGNALED(status)) {\n            printf(\"child process failed: killed by signal %d (PID %d)\\n\",\n                   WTERMSIG(status), pid);\n        }\n    }\n    return 0;\n}"
                },
                {
                  "type": "paragraph",
                  "html": "Compile <code>calculator.c</code> and test it with all four operations and error cases:"
                },
                {
                  "type": "code",
                  "language": "shell",
                  "label": "testing the complete calculator",
                  "code": "$ gcc -Wall -Wextra -o calculator calculator.c\n$ ./calculator\ncalc> add 2 3\nResult: 5\nchild process exited successfully (PID 4243)\ncalc> sub 10 4\nResult: 6\nchild process exited successfully (PID 4244)\ncalc> multiply 6 7\nResult: 42\nchild process exited successfully (PID 4245)\ncalc> negate 5\nResult: -5\nchild process exited successfully (PID 4246)\ncalc> add 2 abc\n./add: invalid argument\nchild process exited unsuccessfully with status 1 (PID 4247)\ncalc> multiply 6\nOperation cannot execute: multiply needs 2 argument(s), got 1\ncalc> divide 4 2\nOperation cannot execute: invalid operator \"divide\"\ncalc> exit"
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Checkpoint",
              "items": [
                "Valid commands fork a child, print <code>Result: ...</code>, and print <code>child process exited successfully (PID ...)</code>.",
                "Non-numeric arguments (like <code>add 2 abc</code>) cause the child to return 1 and the parent to print <code>child process exited unsuccessfully with status 1 (PID ...)</code>.",
                "Invalid operators and wrong argument counts are caught by the parent without forking."
              ]
            }
          ]
        },
        {
          "id": "s3-6",
          "no": "3.6",
          "title": "Edge cases & watching the processes live",
          "blocks": [
            {
              "type": "lede",
              "html": "Your calculator is up and running! Before moving to Phase 4, let's test edge cases and watch the parent and child processes live in the Linux process table."
            },
            {
              "type": "heading",
              "level": 3,
              "html": "Quick edge-case checklist"
            },
            {
              "type": "table",
              "head": [
                "Input at calc&gt;",
                "What should happen"
              ],
              "rows": [
                [
                  "<code>add   7   8</code> (extra spaces/tabs)",
                  "Prints <code>Result: 15</code> and exits successfully"
                ],
                [
                  "Empty line (just press Enter)",
                  "Shows a fresh <code>calc&gt; </code> prompt with no error"
                ],
                [
                  "<code>negate -5</code> (negative input)",
                  "Prints <code>Result: 5</code>"
                ],
                [
                  "<code>add 1 2 3</code> (too many arguments)",
                  "Prints <code>Operation cannot execute: add needs 2 argument(s), got 3</code>"
                ],
                [
                  "<code>add 99999999999999999999 1</code> (overflow)",
                  "Child reports invalid argument; parent reports status 1"
                ],
                [
                  "<code>exit</code>, <code>quit</code>, or <kbd>Ctrl</kbd>+<kbd>D</kbd>",
                  "Exits cleanly with status 0"
                ]
              ]
            },
            {
              "type": "exercise",
              "label": "Task: see parent and child live in ps",
              "blocks": [
                {
                  "type": "list",
                  "ordered": true,
                  "items": [
                    "Temporarily add <code>sleep(10);</code> (and <code>#include &lt;unistd.h&gt;</code>) at the top of <code>main</code> in <code>add.c</code>, and recompile <code>add</code>.",
                    "Run <code>./calculator</code> and type <code>add 2 3</code>. It will pause for 10 seconds while the child runs.",
                    "In a <strong>second terminal window</strong>, run <code>ps -o pid,ppid,stat,comm --forest</code>. Find <code>calculator</code> and <code>add</code>\u2014notice that <code>add</code>'s PPID is <code>calculator</code>'s PID!",
                    "Remove <code>sleep(10);</code> from <code>add.c</code> and recompile <code>add</code>."
                  ]
                }
              ]
            },
            {
              "type": "checkpoint",
              "title": "Phase 3 checkpoint",
              "items": [
                "All five C files (<code>calculator.c</code>, <code>add.c</code>, <code>sub.c</code>, <code>multiply.c</code>, <code>negate.c</code>) are written, compiled, and working.",
                "I tested the edge cases in the table above and can explain every part of my code."
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

