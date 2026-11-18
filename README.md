# marcbentoy.dev

Personal portfolio of Marc Vincent Bentoy, software engineer in Cebu, Philippines.
Live at **https://marcbentoy.dev**, deployed with Cloudflare Pages.

Plain HTML, CSS and a little JS. No build step, no dependencies.

## Layout

```
index.html       home: hero, highlights, experience, projects, contact
projects.html    all projects
blogs.html       writing
about.html       about me
now.html         what I'm doing now
404.html         not-found page (served by Cloudflare Pages automatically)
styles.css       all styles
anim.js          speeds up card illustrations on hover
nav.js           smooth scroll for cross-page section links
_headers         Cloudflare Pages response headers
robots.txt, sitemap.xml
resume.pdf       (add this; nav and hero link to it)
```

## Run locally

```sh
python3 -m http.server 8000      # then open http://localhost:8000
```

## Deploying

- Push to `main` → production deploy on marcbentoy.dev.
- Push any other branch → preview deploy at `<branch>.<project>.pages.dev`.

Cloudflare Pages settings: framework preset **None**, build command **empty**, output directory **`/`**.

## Workflow

```sh
git switch -c feat/some-change    # branch for each change
# edit, preview locally
git commit -am "feat: describe the change"
git push -u origin feat/some-change   # get a preview URL, open a PR
# merge the PR → goes live
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
