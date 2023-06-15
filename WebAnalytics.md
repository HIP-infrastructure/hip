# HIP Web analytics

## Matomo is a powerful web analytics tool that help to track and measure the usage of web applications.

### Tracking

- category: 'Desktop',

  action: 'Create a desktop'  
   action: 'Remove a desktop'
  action: 'Use a desktop'  
   action: 'Pause a desktop'  
   action: 'Resume a desktop'

  name: `center/${params.centerId}`  
   name: `project/${project?.name}`

  action: 'Start an application'  
   action: 'Stop an application'

  name: `center/${params.centerId} ${app.name}`  
   name: `project/${project?.name} ${app.name}`

- category: 'Project'

  action: 'Create a project',
  action: 'Remove project',
  action: 'Add user to project',
  action: 'Remove user from project',

  name: `project/${project.name}`,

- category: 'BIDS'

  action: 'Import subject'

  name: `${selectedBidsDataset?.Path}`,
  value: 0|1

### Goals

See https://stats.humanbrainproject.eu/

### Reports

### Analyze
