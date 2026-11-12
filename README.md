# MyEasyScience full platform starter

A full-stack starter for **myeasyscience.com** built with Next.js, TypeScript, Tailwind CSS and Supabase.

## Included
- Responsive MyEasyScience homepage and course library
- Supabase email/password registration and login
- Protected student dashboard
- Starter Chemistry, Biology, Physics and Mathematics courses
- Lesson viewer with saved lesson completion
- Interactive science quiz with saved attempts
- Supabase schema with row-level security (RLS)
- Free/premium membership page with Stripe Checkout subscription flow and signed webhook sync
- Stripe-backed subscription status stored on the student profile

## Requirements
- Node.js 20.9 or later
- A Supabase account and project
- A hosting account (Vercel is a straightforward option)

## Run locally
1. Extract the ZIP and open the project folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`.
4. In Supabase, open **Project Settings → API** and copy the Project URL and anon/public key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
5. In Supabase, open **SQL Editor**, paste and run `supabase/schema.sql`. If you already ran an earlier version, also run the migration below.
6. In Stripe, create a recurring Premium Price and copy its Price ID into `STRIPE_PREMIUM_PRICE_ID`. Add your Stripe secret key and the Supabase service-role key to `.env.local` (server-side only).
7. Create a Stripe webhook endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`; put its signing secret in `STRIPE_WEBHOOK_SECRET`. For local testing, use the Stripe CLI to forward events to `http://localhost:3000/api/stripe/webhook`.
8. In Supabase Authentication settings, configure the Site URL and allowed redirect URLs for local development (`http://localhost:3000`) and your eventual production domain.
9. Start the app:
   ```bash
   npm run dev
   ```
10. Visit http://localhost:3000, create an account, open a course, complete lessons and try the dashboard quiz.

## Deploy
1. Push the project to a private or public Git repository.
2. Import it into Vercel.
3. Add all environment variables from `.env.example` in Vercel project settings. Keep `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` server-only; never prefix them with `NEXT_PUBLIC_`.
4. Deploy, then add your custom domain `myeasyscience.com` in Vercel and update DNS records at your domain registrar.
5. Update Supabase Authentication Site URL and redirect URL allowlist to use your production domain.

## Important setup and security notes
- Do not put a Supabase service-role key in browser code or commit secrets.
- RLS policies ensure each student can read and write only their own progress and quiz records.
- The membership flow uses Stripe Checkout and a signed webhook. Configure a recurring Stripe Price and webhook before testing payments. The webhook uses the Supabase service-role key and must remain server-side. For existing databases, run `alter table public.profiles add column if not exists stripe_customer_id text unique; alter table public.profiles add column if not exists stripe_subscription_id text unique; alter table public.profiles add column if not exists subscription_status text;`.
- The `role` field is a foundation for admin tools. Before launching admin functions, add server-side role checks and admin-only RLS policies; never rely on hiding buttons in the browser.
- Starter lesson content and quiz questions are examples. Replace them with reviewed, age-appropriate curriculum content.
- This is a functional foundation, not a finished production deployment. Test authentication, email confirmation, RLS, backups, privacy policy, terms and accessibility before inviting students.
- If your audience includes children, review applicable child privacy and parental-consent requirements for the countries where you operate before collecting personal information.

## Premium membership setup
1. Configure a recurring Premium product/price in Stripe.
2. Set `NEXT_PUBLIC_SITE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Register the webhook events listed above. Stripe test mode should be used until pricing, cancellation, refunds, tax, and customer support policies are ready.
4. Visit `/membership` to view the plans and test checkout.

The webhook updates a profile's `membership_tier` only after Stripe sends a verified event. Protect all premium lesson content with server-side entitlement checks; hiding premium links in the UI alone is not access control. The starter course catalogue is still sample content and does not yet include a full admin authoring interface.


## Virtual Science Labs (Version 3)

The platform now includes four browser-based interactive simulations:
- **Chemistry:** select example solutions and observe a simplified pH indicator.
- **Physics:** adjust pendulum length and starting angle; see the estimated period and frequency.
- **Biology:** select structures in a simplified plant-cell diagram to learn their functions.
- **Mathematics:** resize a rectangle and calculate area and perimeter.

Routes:
- `/labs`
- `/labs/chemistry`
- `/labs/physics`
- `/labs/biology`
- `/labs/mathematics`

These are educational simulations, not laboratory protocols or substitutes for supervised real-world experiments. Lab interactions currently run in the browser and are not saved to student progress.


## Admin dashboard (Version 4)

After applying the updated `supabase/schema.sql`, promote your own account to admin using the SQL statement at the bottom of that file (replace `YOUR_ADMIN_EMAIL`). Then sign in and open `/admin`.

The admin workspace includes:
- Server-verified admin-only access
- Registered learner overview and latest learner accounts
- Admin-created course library
- Course creation with subject, level, description, lesson titles and lesson bodies
- Course deletion
- New courses automatically appear in the public course catalogue and lesson pages

The dashboard does not yet include lesson editing, quiz authoring, student account suspension, or detailed analytics. Starter courses remain in the codebase; admin-created courses are stored in Supabase.


## Interactive Periodic Table (Version 5)

New route: `/periodic-table`

Features:
- All 118 elements arranged in a periodic-table layout, with lanthanides and actinides displayed in separate rows.
- Selectable element tiles with atomic number, symbol, name and relative atomic mass.
- Element-family colour coding and family filter chips.
- Search by element name, symbol or atomic number.
- Detail panel with group, period, family description, simplified state-at-room-temperature information, selected electron configurations and element facts.
- Homepage feature link and main navigation link.

The table runs entirely in the browser and does not require a database migration. Some properties for newly synthesised superheavy elements are uncertain; the interface labels these as unknown where appropriate.


## Chemical Equation Balancer (Version 6)

New route: `/equation-balancer`

Features:
- Enter reactants and products using chemical formulas, with `+` and `->` / `→`.
- Balancing engine solves for the smallest positive whole-number coefficients for supported reactions.
- Formula parser supports element symbols, numeric subscripts, and parentheses such as `Ca(OH)2`.
- Atom-count verification table demonstrates conservation of each element.
- Includes six practice reactions and explanatory balancing steps.
- Linked from the site navigation and homepage.

Current input limitations: ionic charges, hydrate dot notation, state symbols, and reactions with multiple independent balancing solutions are not supported. This is an educational starter tool; review results for advanced or unusual reactions.


## Chemistry Quiz and Practice Centre (Version 7)

New route: `/chemistry-practice`

Features:
- Topic selection: elements & periodic table, chemical formulas, chemical reactions, or all topics.
- Beginner and intermediate difficulty filters.
- 18 curated multiple-choice questions.
- Instant answer feedback, progress tracking and explanations in the results review.
- Retry the full set or practise only missed questions.
- Homepage and navigation links.

Practice progress currently lives only in the browser session and is not saved to student accounts. Question content is starter material and should be curriculum-reviewed before broad classroom use.


## Student Learning Progress Centre (Version 8)

New route: `/progress` (sign-in required).

Features:
- Aggregated lesson completion counts and per-course progress bars.
- Recent saved quiz attempts and overall accuracy across the most recent 100 attempts.
- Seven-day activity view and current learning streak based on saved lesson completions and quiz submissions.
- Achievement milestones for first lesson, first quiz, five lessons, three-day streak, course completion, and quiz performance.
- Recent learning activity list.
- Links from the student dashboard and main navigation.

No database migration is required. The page derives its information from existing `lesson_progress` and `quiz_attempts` records. Streak dates use UTC calendar days. Only activities already saved to Supabase are included; the browser-only Chemistry Practice Centre does not yet save attempts.


## Version 9 — Saved chemistry practice history

- Chemistry Practice saves completed attempts to `quiz_attempts` when the learner is signed in and Supabase is configured.
- Each saved attempt includes topic, difficulty, score, and per-question review (chosen answer, correct answer, correctness and explanation).
- `/progress` displays expandable answer-by-answer reviews under saved quiz attempts.
- Anonymous learners can still complete quizzes; results remain visible on screen but are not stored to an account.
- Database update: run the updated `supabase/schema.sql` in Supabase SQL Editor. It includes a migration-safe `ALTER TABLE ... ADD COLUMN IF NOT EXISTS answer_details` statement. Existing records remain valid and will have no answer details.


## Version 10 — Administrator learner reporting

- New administrator-only page: `/admin/reports`.
- Reports learner account activity, lesson completions, quiz attempt counts, average quiz accuracy, course engagement, quiz performance by quiz, and latest submissions.
- Report is limited to the latest 100 learner profiles, 500 quiz attempts and 5,000 lesson completions to keep page queries bounded.
- Updated `supabase/schema.sql` with admin-only SELECT policies for all lesson progress and quiz attempts. Existing learner-own-record policies remain in place.
- Apply the updated SQL in Supabase before using the reports page. Access is checked server-side; the database policies also restrict cross-learner data access to admins.


## V11 — Teacher workspace and classrooms

New routes:
- `/teacher` — teacher workspace for creating classrooms, sharing invite codes, publishing assignments and viewing basic roster counts.
- `/classroom` — student area to join a class using an eight-character code, view assignments and mark work complete.

### V11 setup
1. Run the **entire updated** `supabase/schema.sql` in the Supabase SQL Editor. It is designed to be re-run and adds the classroom tables, policies, helper functions and student join RPC.
2. Create the teacher's account through the normal signup page.
3. Promote the account in Supabase SQL Editor:
   `update public.profiles set role = 'teacher' where id = (select id from auth.users where email = 'TEACHER_EMAIL');`
4. Sign out and back in as the teacher, then open `/teacher`.
5. Share the generated invite code with students. Students must have their own signed-in student accounts and join at `/classroom`.

Classroom permissions are enforced with Supabase Row Level Security. Students can only see their own memberships and submissions plus classes/assignments they joined. Teachers can manage their own classes and assignments. The join function validates the signed-in student and invite code server-side.

Current scope limitations: assignments are completion check-offs, not file submissions or graded work; there is no class messaging, bulk invitation, parent access, rubric grading or teacher analytics dashboard yet. Teacher roster counts and assignment lists are bounded by the page queries.


## V12 — Learning games, badges and certificates

New route:
- `/rewards` — personal rewards hub with achievement badges, a 10-question mixed-subject science challenge, and printable course-completion certificates.

Badges are calculated from the signed-in learner's saved lesson and quiz activity. Certificates appear when every lesson in a course has been marked complete and can be printed from the browser. The quick challenge is browser-only and its score is not saved. No additional database migration is required for V12.

Certificates are informal learning acknowledgements, not accredited qualifications. Badge counts and course completion depend on the activity records currently stored in the learner's account.


## V13 — Science Arcade and timed competitions

New route:
- `/arcade` — public interactive games hub with Element Detective, Equation Sprint, Cell Structure Match, Physics Puzzle Lab and a 60-Second mixed-subject competition.

The games provide instant feedback and short explanations. The arcade is linked from the main navigation and homepage. It uses browser-only state and does not require a database migration; arcade scores are not saved to student accounts or admin reports. The equation game uses selected balanced-equation examples as a multiple-choice practice activity; it is not a replacement for the full equation balancer.


## Biology Discovery Zone (Version 14)

- Visit `/biology-lab` for four interactive biology activities.
- Plant cell explorer: select organelles in a simplified diagram and read their functions.
- DNA base-pair challenge: practise complementary DNA base pairing with instant feedback and a score.
- Ecosystem builder: arrange a grassland food chain and check the direction of energy transfer.
- Human body systems: match organs to the circulatory, respiratory, digestive and nervous systems.
- The page is public and browser-based. Activity scores are not stored in Supabase; no database migration is required.
- Models are simplified learning aids and should be supplemented with reviewed curriculum content.


## Biology Studio Expansion (Version 15)

- Expanded `/biology-lab` with a virtual microscope, genetics inheritance simulator, human anatomy explorer, and predator–prey population lab.
- Microscope samples are clearly labelled schematic illustrations, not real microscope images.
- Genetics simulator demonstrates a single dominant/recessive gene model using a Punnett square.
- Anatomy explorer uses a simplified, not-to-scale body diagram and organ descriptions.
- Population lab is an illustrative toy model, not a scientific ecological forecast.
- Activities run in the browser and do not save scores or require a database migration.


## Human Body and Plant Biology Expansion (Version 16)

- Expanded the Biology Lab with a selectable organ-system explorer covering circulatory, respiratory, digestive and nervous systems.
- Plant biology lab includes three interactive experiments: photosynthesis factor model, transpiration environment model, and step-by-step seed germination model.
- Photosynthesis and transpiration indicators are simplified conceptual models, not empirical measurements or calibrated scientific predictions.
- Germination activity models the need for water, oxygen and a suitable temperature; timing is illustrative and varies by species.
- Browser-only activities; no database migration or saved scores.


## Genetics and Evolution Centre (Version 17)

- New `/biology-lab` section with three interactive activities: Mendelian single-gene inheritance Punnett square, point-substitution mutation explorer, and beetle camouflage natural-selection simulation.
- Inheritance outcomes are probabilities in a simplified dominant/recessive model, not a claim that complex human traits are controlled by one gene.
- Mutation sequence is synthetic and not a real gene; no medical inference is possible.
- Natural selection simulation uses illustrative fitness weights and percentage-based population proportions, not real empirical data.
- Browser-only; no database migration or saved scores.


## V18 — Microbiology & Immunity Lab

The Biology Lab (`/biology-lab`) now includes a browser-based Microbiology & Immunity Lab:
- Microbe explorer for bacteria, viruses, fungi and protozoa, with schematic illustrations and key features.
- Step-by-step immune response journey covering innate barriers, early response, antigen presentation, adaptive immunity and immune memory.
- Everyday infection-prevention scenario challenge with instant feedback and score.
- Antibiotic-resistance selection model showing how treatment can increase the proportion of resistant bacteria in a population.
- Educational caveats distinguish illustrative models from clinical advice or real laboratory protocols. No pathogen cultivation or wet-lab instructions are included.

This addition is client-side and does not require a database migration. Activity state is local to the browser session and is not saved to learner records.


## V19 — Ecology & Ecosystems Lab

The Biology Lab (`/biology-lab`) now includes an interactive Ecology & Ecosystems Lab:
- Food-web builder with selectable feeding links and feedback on energy-flow direction.
- Biodiversity explorer for temperate forest, freshwater pond and grassland habitats.
- Environmental-change model with adjustable temperature, rainfall and habitat-cover variables.
- Ecosystem event scenarios covering native plants, pesticide impacts, wetland loss and wildlife corridors.
- Clearly labelled illustrative index and learning caveats; this is not a scientific forecast.

This addition is browser-only and does not require a database migration. Activity state is not saved to learner records.


## V20 — Evolution & Natural Selection Game

The Biology Lab (`/biology-lab`) now includes an interactive natural-selection game:
- Choose snowy tundra, dark forest or pale desert habitats.
- Predict which inherited fur-colour trait may provide camouflage.
- Advance up to 12 generations and watch illustrative trait frequencies change.
- Review population history and concepts of variation, selection and adaptation.
- Educational caveats explain that natural selection acts on heritable variation and that the toy model is not a scientific forecast.

This addition is browser-only and does not require a database migration. Game state is not saved to learner records.


## V21 — Human Biology Challenge Centre + Physics Discovery Lab

### Human Biology Challenge Centre
Available within `/biology-lab`:
- Organ-system knowledge quiz with instant explanations.
- Single-gene inheritance puzzle with selectable parent genotypes and a live Punnett outcome.
- Short exam-style practice questions on physiology, genetics and immunity.
- Explicit teaching-model caveat: simple dominant/recessive inheritance does not describe most human traits.

### Physics Discovery Lab
New dedicated route: `/physics-lab`
- Average-speed experiment: adjust distance and time.
- Newton's second-law model: adjust mass and acceleration to calculate net force.
- Gravitational potential energy model: adjust mass, height and useful-energy efficiency.
- Ohm's-law circuit model: adjust voltage and resistance to calculate current and power.
- Reset controls and explanations for each equation.

Navigation
- Added Physics Lab to the site navigation.
- Biology and Physics subject cards now link directly to their learning labs.
- Added a Physics Lab callout on the homepage.

These additions are browser-based and do not require a database migration. Activity state is not saved to learner records. Models are educational simplifications, not experimental measurements.


## V22 — Physics Frontiers Expansion

The Physics Lab (`/physics-lab`) now includes:
- Waves & light: wave-speed calculator (`v = f × λ`), schematic wave display, and plane-mirror reflection angle explorer.
- Magnetism: electromagnet comparison model using coil turns and current, with a clearly labelled relative-strength indicator.
- Heat & thermal energy: calculate `Q = m × c × ΔT` and review conduction, convection and radiation.
- Space & planets: explore all eight planets, orbital periods, approximate surface gravity, and calculate weight for a selected mass.
- Physics exam practice: five interactive questions with marking, explanations and a score.

The earlier motion, forces, gravitational potential energy and circuits activities remain available. No database migration is required; activity state is browser-only and is not saved to learner records. Numerical models are educational simplifications.


## V23 — Dark Mode & Light Mode

The site now includes a theme toggle in the header:
- Switch between light and dark appearance from any page.
- Theme preference is saved in browser local storage and restored on later visits.
- Applies globally to the main site shell and common learning-platform surfaces, text, borders and form controls.
- No account setting or database migration is required; the preference is stored locally in the current browser.
