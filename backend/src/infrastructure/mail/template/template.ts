export const welcomeEmailTemplate = (name: string) => `
  <html>
    <body>
      <h1>Welcome, ${name}!</h1>
      <p>We're excited to have you on board. Please feel free to explore our platform.</p>
      <p>Start your journey by checking out your dashboard: <a href="${process.env.FRONTEND_URL}">Dashboard</a></p>
      <p>If you have any questions, feel free to reach out to us!</p>
    </body>
  </html>
`;

export const teamMemberAddedTemplate = (team_name: string, team_uuid: string) => `
  <html>
    <body>
      <h1>Welcome to Team ${team_name}!</h1>
      <p>You have been successfully added to the team. You can start collaborating on your team project right away.</p>
      <p>Check out your team details here: <a href="${process.env.FRONTEND_URL}/team/${team_uuid}">Team Details</a></p>
    </body>
  </html>
`;

export const taskAssignmentTemplate = (task_name: string, project_uuid: string, team_uuid: string) => `
  <html>
    <body>
      <h1>You have been assigned a new task: ${task_name}</h1>
      <p>Please check out the task details and project here:</p>
      <p><a href="${process.env.FRONTEND_URL}/team/${team_uuid}/project/${project_uuid}">Task Details</a></p>
    </body>
  </html>
`;