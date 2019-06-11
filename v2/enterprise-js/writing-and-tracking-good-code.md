# Writing And Tracking Good Code

### Technical Debt

I'm not very sure why I'm notating this section, but it stuck out to me.

<br>

https://softwareengineering.stackexchange.com/

> I'm doing 90% maintenance and 10% development, is this normal?

<br>

Minimum Viable Products becoming a company's flagship after quality and tests
continue to be sacrificed to meet deadlines.

- Lack of talent
- Lack of time
- Lack of morale

Repay debt by refactoring your shitty but functional one-pager kitchen sink app.

<br>

### TDD Process

1. Identify smallest functional unit of feature that's to be implemented
2. Identify a test case and write it ( happy path first, then edge cases )
3. Run test, watch it fail
4. Write enough code for the test to pass
5. Refactor, integrate as necessary

<br>

> Write tests before implementation to force yourself to think about and digest   <br>
> what your requirements are and how consumers consume your interface.

> TDD focuses on a single functional block at a time, its development cycles are  <br>
> usually very short (minutes to hours). This means small, incremental changes    <br>
> can be made and released rapidly.

> Always code as if the guy who ends up maintaining your code will be a violent   <br>
> psychopath who knows where you live

<br>

### Jargon

<strong>Isomorphic, Universal JS frameworks</strong> <br>
Write apps entirely in JS running on both client and server ( Meteor, etc ).

<strong>Single Page Applications</strong> <br>
Let the client handle logic and rendering, allowing the server to handle more
requests and the UI to be more responsive since you're not waiting for the
server to respond.

<strong>Server-side Rendering ( SSR )</strong> <br>
Counteract deficiancy of long initial load times for SPA's and helps with SEO
performance by helping crawlers decipher page views faster ( additional assets
get downloaded at some time in the future ).

<br>

### Git Flow

Technically a proposal by Driessen for a branching model that Git integrated.

[Driessen model](https://learning.oreilly.com/library/view/building-enterprise-javascript/9781788477321/assets/132cf42f-d48c-4d5f-98bf-59f33c203c56.png)

- `dev` branch, main branch developers work on
- `master` branch, only prod-ready, tested and approved code
- Feature branches, branch off `dev`, new features, non-critical bugs
- Release branches, branch off `dev`, tentatively prod-ready pending more tests
- Hotfix branches, branch off `master`, issues to be fixed ASAP

<br>

<strong>Git repo create</strong>

```
$ git init
$ git branch
> * master
( create github repo )
$ remotes add --remote <remote_url> --host jsore    # special SSH key config
$ echo "# Title" >> README.md
$ git add -A && git commit -m "First commit"
$ git push -u origin master     # only have to specify -u once, the 1st time only
$ git checkout -b dev master    # create new branch and switch to it
> Switched to a new branch 'dev'
$ git branch
> * dev
>   master
```

<br>

<strong>Build a new feature, remember to only branch off `dev`</strong>
```
$ git branch
> * dev
>   master
$ git checkout -b social-login dev
> Switched to a new branch 'social-login'       # main feature branch
$ git checkout -b facebook-login social-login   # sub-feature of this feature
> Switched to a new branch 'facebook-login'
```

Or, using a grouping token with a delimiter for sub-branch naming
```
$ git checkout -b social-login.facebook social-login
> Switched to a new branch 'social-login.facebook'
$ git checkout -b social-login.twitter social-login    # another sub-feature
> Switched to a new branch 'social-login.twitter'
$ git branch
>   dev
>   master
>   social-login
>   social-login.facebook
> * social-login.twitter
```

<br>

<strong>Merging our new features</strong>

1. Merge sub-features into main feature branch
2. Merge feature branch into `dev`
3. Create a release branch off `dev` and merge that release into `master`

Merge the feature sub-branches on main feature branch
```
$ git checkout social-login
$ git merge social-login.facebook
> Updating <commit>
> Fast-forward
>  social-login.txt | 1 +
>  1 file changed, 1 insertion(+)

$ git log --graph --oneline --decorate --all
> * 9204a6b (social-login/twitter) Implement Twitter login
> | * 09bc8ac (HEAD -> social-login/main, social-login/facebook) Implement Facebook login
> |/
> * 8d9f102 Add a blank social-login file
> * cf3221a (master, dev) Add main script and documentation
> * 85434b6 Update README.md
> * 6883f4e Initial commit

$ git merge social-login.twitter    # oops, merge conflict
> Auto-merging social-login.txt
> CONFLICT (content): Mege conflict in social-login.txt

    fix the conflict, edit the file causing conflict and update content
    to match version currently on master branch then complete the merge

$ git status
> On branch social-login
> You have unmerged paths.
> Unmerged paths:
>   both modified: social-login.txt
$ git add -A && git commit -m "Resolve merge conflict"
> [social-login <id>] Resolve merge conflict

    now log can be reviewed, showing implementation of Facebook and Twitter
    features on separate branches and merged them together in a separate
    commit ( the one with hash 37eb1b9 )

$ git log --graph --oneline --decorate --all
> * 37eb1b9 (HEAD -> social-login/main) Resolve merge conflict
> |\
> | * 9204a6b (social-login/twitter) Implement Twitter login
> * | 09bc8ac (social-login/facebook) Implement Facebook login
> |/
> * 8d9f102 Add a blank social-login file
> * cf3221a (master, dev) Add main script and documentation
> * 85434b6 Update README.md
> * 6883f4e Initial commit
```
Now you can begin merging onto `dev`

<br>

<strong>Always try to keep `dev` branch bug free, other people may be working on it.</strong>

Merging your new feature into `dev` might break it because of changes from others.

Use `rebase` to merge changes and keep Git log history clean. Merging creates a
new commit for the merge. `rebase` tries to place the changes on the feature
branch as if they were made directly after the last commit on the main branch.

```
# act like we're back to the point where we merged the facebook sub-branch
$ git checkout social-login
$ git merge social-login.facebook     # we already know there won't be conflicts...
$ git checkout social-login.twitter   # ...and that merging this throws a conflict
$ git rebase social-login             # this keeps log history pretty
> ...
> CONFLICT (content): ...

    fix the conflict, get ready to merge again but use --continue
    instead of git commit

$ git add -A
$ git rebase --continue
> Applying: Implement Twitter login

$ git log --graph --oneline --decorate --all
> * da47828 (HEAD -> social-login/twitter) Implement Twitter login    # linear history
> * e6104cb (social-login/main, social-login/facebook) Implement Facebook login
> * c864ea4 Add a blank social-login file
> | * 8f91c9d (user-schema/main, dev) Add User Schema   # some other feature branch
> |/
> * d128cc6 (master) Add main script and documentation
> * 7b78b0c Update README.md
> * d9056a3 Initial commit

    next fast-forward main social-login branch to follow social-login.twitter

$ git checkout social-login
$ git merge social-login.twitter

    then rebase main branch onto dev branch to check for bugs

$ git checkout social-login
$ git rebase dev            # linear history
$ git checkout dev
$ git merge social-login    # ,,,plus we've already checked for bugs
```

Now your history is completely linear on the main feature branch even though
the changes originated from different branches.

<br>

<strong>Use `rebase` and `merge` together so you don't lose context.</strong>

- `rebase` for feature branches or bug fixes
- `merge --no-ff` when integrating into permanent `dev` or `master` branches

<br>

<strong>Delete branches after they've been integrated</strong>
```
$ git branch -D social-login.facebook social-login.twitter
```

<br>

<strong>Release with semver names</strong>

- 0.1.0
- MAJOR.MINOR.PATCH
- Patch: after backward-compatible hotfix
- Minor: after a backward-compatible set of features/bugfixes have been implemented
- Major: after a non backward compatible change

```
$ git checkout dev                # releases get branched off dev
$ git checkout -b release/0.1.0   # added features: social-login

    oops: found a bug.
    release branch bugfixes get committed directly on that branch

$ git checkout release/0.1.0
( fix the bug )
$ git add -A && git commit -m "Fix typo in social-login.txt"

    test for bugs again, once clean merge into master

$ git checkout master
> Switched to branch 'master'
$ git merge --no-ff release/0.1.0

    apply bugfix made on release branch back into dev and any other
    active release branches

$ git checkout dev
$ git merge --no-ff release/0.1.0
```

<br>

<strong>Releases are important, represent them as tags on `master`</strong>
```
$ git checkout master
$ git tag -a 0.1.0 -m "Message about additions"    # -a for annotated (informative)
$ git show 0.1.0
> tag 0.1.0
> Tagger: Daniel Li <dan@danyll.com>
> Date: Fri Dec 8 21:11:20 2017 +0000
> Implement social login. Update user schema.
>
> commit 6a415c24ea6332ea3af9c99b09ed03ee7cac36f4 (HEAD -> master, tag: 0.1.0)
> Merge: b54c9de 62020b2
> Author: Daniel Li <dan@danyll.com>
> Date: Fri Dec 8 18:55:17 2017 +0000
>     Merge branch 'release/0.1.0'

    git doesn't auto push tags to remotes, when ready to push do it manually

$ git push origin [tagname]   # specific tag
$ git push origin --tags      # all tags
```
