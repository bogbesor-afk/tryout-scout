// Grounded in common youth/high school coaching practice and standard tactical
// theory. Given to the AI as background context so its summaries, rankings
// reasoning, and lineup suggestions sound like they come from someone who
// understands the sport, not a generic assistant.
export const SOCCER_KNOWLEDGE = `
SOCCER EVALUATION FRAMEWORK

Coaches typically evaluate tryout players across four dimensions:
- Technical skill: first touch, passing accuracy, dribbling, shooting, receiving under pressure.
- Tactical awareness: positioning, decision-making, reading the game, off-the-ball movement.
- Physical attributes: speed, endurance, strength, agility.
- Mental/coachability: work ethic, composure, communication, coachability, attitude.

These map to the app's six rating categories: technical_skill, speed, decision_making,
effort, communication, positioning.

WHAT TO LOOK FOR BY POSITION

Goalkeeper: shot-stopping, command of the box, distribution (throws/goal kicks), communication
with the back line, composure under pressure.
Defender: 1v1 defending, positioning/marking, aerial ability, passing out from the back,
recovery speed.
Midfielder: passing range and tempo control, receiving under pressure, work rate box-to-box,
vision for through balls, defensive tracking.
Forward: finishing, movement in behind, hold-up play, pressing the first defender, composure
in the box.

FORMATIONS AND WHEN THEY FIT

4-4-2: Two banks of four plus two strikers. Simple, balanced, forgiving for less experienced
teams; needs disciplined wide midfielders willing to track back.
4-3-3: Three central midfielders (often one holding, two box-to-box or one holding, one
box-to-box, one attacking) plus two wingers and a central striker. Rewards technical
midfielders and pacey wingers; the most common modern base formation.
3-5-2: Three center backs, wing-backs providing width, two strikers. Needs wing-backs with
excellent stamina since they cover the full flank alone; strong in midfield numbers.
4-2-3-1: Two holding midfielders (double pivot) shielding the back four, an attacking
midfielder, two wide forwards, one striker. Good for teams with a standout #10 and squads
that need extra defensive solidity in midfield.

The right formation depends on squad composition, not just preference: pick the shape that
fits how many genuine wide players, ball-winners, and out-and-out strikers the roster
actually has, rather than forcing a shape the players aren't suited for.

TACTICAL CONCEPTS

Pressing: coordinated pressure to win the ball back high up the pitch; needs fitness and
tactical discipline across the team.
Possession play: keeping the ball through short passing and patient buildup; needs composed
technical players comfortable receiving under pressure.
Counter-attacking: absorbing pressure then transitioning quickly on turnover; needs pace in
behind and direct passing.
Width: using the full pitch through wingers or overlapping fullbacks/wing-backs to stretch
the opposition and create crossing/cutback opportunities.
Transitions: the moments immediately after winning or losing the ball, often where goals are
scored or conceded; well-coached teams have clear rules for what to do in the first few
seconds of a transition.

TRYOUT EVALUATION BEST PRACTICES

Good evaluations are specific and behavioral (what the player actually did), not just a
number. They compare players fairly within the same position group, since a 7/10 defender
and a 7/10 forward are being judged on different skill sets. They also weigh recent,
consistent performance across multiple tryout days over a single standout or poor moment.
`.trim();
