import {
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  Text,
  Textarea,
  Title1,
  Title2,
  DrawerBody,
DrawerHeader,
DrawerHeaderTitle,
OverlayDrawer
} from '@fluentui/react-components';

import {
  Bot24Regular,
  Clock24Regular,
  Warning24Regular
} from '@fluentui/react-icons';

import { useMemo, useState } from 'react';

type RequestStatus = 'New' | 'In Review' | 'Approved' | 'Completed';
type Priority = 'Low' | 'Medium' | 'High';

interface AutomationRequest {
  id: number;
  title: string;
  department: string;
  requestType: string;
  description: string;
  expectedBenefit: string;
  priority: Priority;
  status: RequestStatus;
  aiStatus: 'Not Analyzed' | 'Analyzed';
  aiCategory?: string;
  aiPriority?: Priority;
  aiSummary?: string;
  aiNextStep?: string;
  aiFlowSuggestion?: string;
}

const initialRequests: AutomationRequest[] = [
  {
    id: 1,
    title: 'Automate invoice approvals',
    department: 'Finance',
    requestType: 'Approval Workflow',
    description: 'Invoices are manually reviewed and approved by managers.',
    expectedBenefit: 'Reduce approval delays and improve tracking.',
    priority: 'High',
    status: 'New',
    aiStatus: 'Not Analyzed'
  },
  {
    id: 2,
    title: 'Employee onboarding checklist',
    department: 'HR',
    requestType: 'Notification',
    description: 'HR manually sends onboarding tasks to IT and managers.',
    expectedBenefit: 'Improve consistency and reduce missed tasks.',
    priority: 'Medium',
    status: 'In Review',
    aiStatus: 'Not Analyzed'
  },
  {
    id: 3,
    title: 'Monthly report reminders',
    department: 'Operations',
    requestType: 'Reporting',
    description: 'Managers forget to submit monthly reports on time.',
    expectedBenefit: 'Improve reporting completion and visibility.',
    priority: 'Low',
    status: 'Completed',
    aiStatus: 'Analyzed',
    aiCategory: 'Reporting',
    aiPriority: 'Low',
    aiSummary: 'This request is mainly about sending scheduled reminders.',
    aiNextStep: 'Create a scheduled Power Automate flow.',
    aiFlowSuggestion:
      'Scheduled trigger → Send Teams reminder → Update SharePoint log'
  }
];

function App() {
  const [requests, setRequests] = useState<AutomationRequest[]>(initialRequests);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<AutomationRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [newRequest, setNewRequest] = useState({
    title: '',
    department: 'Finance',
    requestType: 'Approval Workflow',
    description: '',
    expectedBenefit: '',
    priority: 'Medium' as Priority
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchText.toLowerCase()) ||
        request.department.toLowerCase().includes(searchText.toLowerCase()) ||
        request.requestType.toLowerCase().includes(searchText.toLowerCase());

      const matchesDepartment =
        departmentFilter === 'All' || request.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [requests, searchText, departmentFilter]);

  const totalRequests = requests.length;
  const pendingReview = requests.filter((r) => r.status === 'New').length;
  const highPriority = requests.filter((r) => r.priority === 'High').length;
  const analyzed = requests.filter((r) => r.aiStatus === 'Analyzed').length;

  const getAiSuggestion = (request: AutomationRequest) => {
    switch (request.requestType) {
      case 'Approval Workflow':
        return {
          category: 'Approval Workflow',
          priority: request.priority,
          summary: `This request involves an approval process for ${request.title.toLowerCase()}. It is a good candidate for Power Automate approvals.`,
          nextStep:
            'Map the approval stages, identify approvers, and define approval outcomes.',
          flowSuggestion:
            'SharePoint trigger → Manager approval → Conditional outcome → Teams notification → Update request status'
        };

      case 'Notification':
        return {
          category: 'Notification',
          priority: request.priority,
          summary: `This request focuses on reminders or notifications for ${request.title.toLowerCase()}.`,
          nextStep:
            'Define the trigger, audience, message format, and notification channel.',
          flowSuggestion:
            'Scheduled trigger → Get request records → Send Teams/email notification → Log reminder activity'
        };

      case 'Reporting':
        return {
          category: 'Reporting',
          priority: request.priority,
          summary: `This request is related to reporting and visibility for ${request.title.toLowerCase()}.`,
          nextStep:
            'Confirm the required metrics, report frequency, and target audience.',
          flowSuggestion:
            'Scheduled trigger → Read SharePoint/Dataverse data → Generate summary → Send report notification'
        };

      case 'Document Management':
        return {
          category: 'Document Management',
          priority: request.priority,
          summary:
            'This request involves document handling, review, storage, or approval.',
          nextStep:
            'Identify the document library, metadata, review steps, and retention requirements.',
          flowSuggestion:
            'File created trigger → Apply metadata → Start review approval → Notify owner → Update document status'
        };

      case 'Integration':
        return {
          category: 'Integration',
          priority: request.priority,
          summary:
            'This request involves connecting systems or transferring data between platforms.',
          nextStep:
            'Confirm source system, target system, authentication method, and data mapping.',
          flowSuggestion:
            'HTTP/API trigger → Validate data → Transform payload → Send to target system → Log result'
        };

      default:
        return {
          category: 'Other',
          priority: request.priority,
          summary:
            'This request needs further discovery before selecting the best automation approach.',
          nextStep:
            'Run a short discovery session with the business user to clarify process steps.',
          flowSuggestion:
            'Manual review → Process mapping → Solution decision → Create implementation plan'
        };
    }
  };

  const getFlowNodes = (requestType: string) => {
    switch (requestType) {
      case 'Approval Workflow':
        return ['Trigger', 'Manager Approval', 'Conditional Outcome', 'Update Status'];

      case 'Notification':
        return ['Schedule', 'Generate Reminder', 'Send Teams Message', 'Log Activity'];

      case 'Reporting':
        return ['Schedule', 'Get Data', 'Build Summary', 'Send Report'];

      case 'Document Management':
        return ['File Created', 'Apply Metadata', 'Review Approval', 'Archive Document'];

      case 'Integration':
        return ['API Trigger', 'Transform Data', 'Send Payload', 'Log Response'];

      default:
        return ['Discovery', 'Map Process', 'Solution Design', 'Implementation'];
    }
  };

  const analyzeRequest = (request: AutomationRequest) => {
    const suggestion = getAiSuggestion(request);

    const updatedRequest: AutomationRequest = {
      ...request,
      aiStatus: 'Analyzed',
      aiCategory: suggestion.category,
      aiPriority: suggestion.priority,
      aiSummary: suggestion.summary,
      aiNextStep: suggestion.nextStep,
      aiFlowSuggestion: suggestion.flowSuggestion
    };

    setRequests((current) =>
      current.map((item) => (item.id === request.id ? updatedRequest : item))
    );

    setSelectedRequest(updatedRequest);
  };

  const analyzeAllPending = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const updatedRequests: AutomationRequest[] = requests.map((request) => {
        if (request.aiStatus === 'Analyzed') {
          return request;
        }

        const suggestion = getAiSuggestion(request);

        return {
          ...request,
          aiStatus: 'Analyzed',
          aiCategory: suggestion.category,
          aiPriority: suggestion.priority,
          aiSummary: suggestion.summary,
          aiNextStep: suggestion.nextStep,
          aiFlowSuggestion: suggestion.flowSuggestion
        };
      });

      setRequests(updatedRequests);
      setSelectedRequest(updatedRequests[0]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const addRequest = () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      alert('Please complete the title and description.');
      return;
    }

    const requestToAdd: AutomationRequest = {
      id: Date.now(),
      title: newRequest.title,
      department: newRequest.department,
      requestType: newRequest.requestType,
      description: newRequest.description,
      expectedBenefit: newRequest.expectedBenefit,
      priority: newRequest.priority,
      status: 'New',
      aiStatus: 'Not Analyzed'
    };

    setRequests((current) => [requestToAdd, ...current]);
    setSelectedRequest(requestToAdd);

    setNewRequest({
      title: '',
      department: 'Finance',
      requestType: 'Approval Workflow',
      description: '',
      expectedBenefit: '',
      priority: 'Medium'
    });

    setShowForm(false);
  };

  const exportFlowJson = () => {
    if (!selectedRequest) {
      alert('Please select or analyze a request first.');
      return;
    }

    const flowDefinition = {
      requestId: selectedRequest.id,
      requestTitle: selectedRequest.title,
      department: selectedRequest.department,
      requestType: selectedRequest.requestType,
      priority: selectedRequest.priority,
      generatedBy: 'AI Workflow Suggestion Prototype',
      generatedOn: new Date().toISOString(),
      suggestedFlow: {
        summary: selectedRequest.aiSummary,
        nextStep: selectedRequest.aiNextStep,
        flowSuggestion: selectedRequest.aiFlowSuggestion,
        nodes: getFlowNodes(selectedRequest.requestType)
      }
    };

    const blob = new Blob([JSON.stringify(flowDefinition, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${selectedRequest.title
      .toLowerCase()
      .replaceAll(' ', '-')}-flow-suggestion.json`;

    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <Title1>Intelligent Automation Request Manager</Title1>
          <Text>
            React + TypeScript prototype for managing automation requests and AI workflow suggestions.
          </Text>
        </div>

        <Badge appearance="filled" color="brand">
          AI Copilot Suggestion
        </Badge>

        <Button appearance="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Request'}
        </Button>
      </header>

      <nav className="leftNav">
        <div className="navTitle">Automation App</div>

        <div className="commandBar">
          <Button appearance="primary" onClick={() => setShowForm(true)}>
            New
          </Button>

          <Button onClick={analyzeAllPending} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze All'}
          </Button>

          <Button>Export</Button>

          <div style={{ marginLeft: 'auto' }}>
            <Button>Refresh</Button>
          </div>
        </div>

        <div className="navLinks">
          <Button appearance="subtle">Dashboard</Button>
          <Button appearance="subtle">Requests</Button>
          <Button appearance="subtle">Approvals</Button>
          <Button appearance="subtle">Analytics</Button>
          <Button appearance="subtle">Settings</Button>
        </div>
      </nav>

      <section className="dashboard">
        <DashboardCard title="Total Requests" value={totalRequests} icon={<Clock24Regular />} />
        <DashboardCard title="Pending Review" value={pendingReview} icon={<Warning24Regular />} />
        <DashboardCard title="High Priority" value={highPriority} icon={<Warning24Regular />} />
        <DashboardCard title="AI Analyzed" value={analyzed} icon={<Bot24Regular />} />
      </section>

      {showForm && (
        <Card className="formCard">
          <CardHeader
            header={<Title2>New Automation Request</Title2>}
            description={<Text>Submit a new automation idea for review.</Text>}
          />

          <div className="formGrid">
            <Field label="Title" required>
              <Input
                placeholder="Example: Automate invoice approvals"
                value={newRequest.title}
                onChange={(_, data) =>
                  setNewRequest({ ...newRequest, title: data.value })
                }
              />
            </Field>

            <Field label="Department">
              <Select
                value={newRequest.department}
                onChange={(_, data) =>
                  setNewRequest({ ...newRequest, department: data.value })
                }
              >
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="Legal">Legal</option>
              </Select>
            </Field>

            <Field label="Request Type">
              <Select
                value={newRequest.requestType}
                onChange={(_, data) =>
                  setNewRequest({ ...newRequest, requestType: data.value })
                }
              >
                <option value="Approval Workflow">Approval Workflow</option>
                <option value="Document Management">Document Management</option>
                <option value="Notification">Notification</option>
                <option value="Integration">Integration</option>
                <option value="Reporting">Reporting</option>
                <option value="Other">Other</option>
              </Select>
            </Field>

            <Field label="Priority">
              <Select
                value={newRequest.priority}
                onChange={(_, data) =>
                  setNewRequest({
                    ...newRequest,
                    priority: data.value as Priority
                  })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </Field>
          </div>

          <div className="formStack">
            <Field label="Description" required>
              <Textarea
                placeholder="Describe the manual process or business problem..."
                value={newRequest.description}
                onChange={(_, data) =>
                  setNewRequest({ ...newRequest, description: data.value })
                }
              />
            </Field>

            <Field label="Expected Benefit">
              <Textarea
                placeholder="Example: Reduce manual work, improve tracking, avoid delays..."
                value={newRequest.expectedBenefit}
                onChange={(_, data) =>
                  setNewRequest({ ...newRequest, expectedBenefit: data.value })
                }
              />
            </Field>
          </div>

          <div className="formActions">
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button appearance="primary" onClick={addRequest}>
              Submit Request
            </Button>
          </div>
        </Card>
      )}

      <section className="content">
        <Card className="tableCard">
          <CardHeader
            header={<Title2>Automation Requests</Title2>}
            description={<Text>Review, filter and analyze automation ideas.</Text>}
          />

          <div className="filters">
            <Input
              placeholder="Search requests..."
              value={searchText}
              onChange={(_, data) => setSearchText(data.value)}
            />

            <Select
              value={departmentFilter}
              onChange={(_, data) => setDepartmentFilter(data.value)}
            >
              <option value="All">All Departments</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
              <option value="IT">IT</option>
              <option value="Legal">Legal</option>
            </Select>
          </div>

          <div className="table">
            <div className="tableHeader">
              <span>Title</span>
              <span>Department</span>
              <span>Type</span>
              <span>Priority</span>
              <span>Status</span>
              <span>AI Status</span>
              <span>Actions</span>
            </div>

            {filteredRequests.map((request) => (
              <div className="tableRow" key={request.id}>
                <span>{request.title}</span>
                <span>{request.department}</span>
                <span>{request.requestType}</span>
                <span>
                  <PriorityBadge priority={request.priority} />
                </span>
                <span>
                  <StatusBadge status={request.status} />
                </span>
                <span>
                  <Badge
                    appearance="filled"
                    color={request.aiStatus === 'Analyzed' ? 'success' : 'subtle'}
                  >
                    {request.aiStatus}
                  </Badge>
                </span>
                <span className="actions">
                 <Button
  size="small"
  onClick={() => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  }}
>
  View
</Button>

                  <Button
                    size="small"
                    appearance="primary"
                    icon={<Bot24Regular />}
                    onClick={() => analyzeRequest(request)}
                  >
                    Analyze
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="aiPanel">
          <CardHeader
            header={<Title2>AI Recommendation</Title2>}
            description={<Text>Suggested workflow approach for the selected request.</Text>}
          />

          {!selectedRequest && (
            <div className="emptyState">
              <Bot24Regular />

              <Card className="copilotCallout">
                <Text weight="semibold">
                  Ask AI for workflow recommendations
                </Text>

                <Text>
                  Analyze requests to generate Power Automate suggestions.
                </Text>

                <Button appearance="primary" onClick={analyzeAllPending}>
                  Analyze Selected
                </Button>
              </Card>
            </div>
          )}

          {selectedRequest && (
            <div className="recommendation">
              <Text weight="semibold">Request</Text>
              <Text>{selectedRequest.title}</Text>

              <Text weight="semibold">Summary</Text>
              <Text>{selectedRequest.aiSummary ?? 'Not analyzed yet.'}</Text>

              <Text weight="semibold">Suggested Category</Text>
              <Text>{selectedRequest.aiCategory ?? '-'}</Text>

              <Text weight="semibold">Suggested Priority</Text>
              <Text>{selectedRequest.aiPriority ?? '-'}</Text>

              <Text weight="semibold">Recommended Next Step</Text>
              <Text>{selectedRequest.aiNextStep ?? '-'}</Text>

              <Text weight="semibold">Suggested Power Automate Flow</Text>
              <Text>{selectedRequest.aiFlowSuggestion ?? '-'}</Text>

              <div className="flowPreview">
                {getFlowNodes(selectedRequest.requestType).map((node, index) => (
                  <div key={index}>
                    <div className="flowNode">{node}</div>

                    {index < getFlowNodes(selectedRequest.requestType).length - 1 && (
                      <div className="flowArrow">↓</div>
                    )}
                  </div>
                ))}
              </div>

              <Button appearance="primary" onClick={exportFlowJson}>
                Export Flow JSON
              </Button>
            </div>
          )}
        </Card>
      </section>

      <OverlayDrawer
  position="end"
  open={isDrawerOpen}
  onOpenChange={(_, data) => setIsDrawerOpen(data.open)}
>
  <DrawerHeader>
  <DrawerHeaderTitle
    action={
      <Button
        appearance="subtle"
        onClick={() => setIsDrawerOpen(false)}
      >
        Close
      </Button>
    }
  >
    Request Details
  </DrawerHeaderTitle>
</DrawerHeader>

  <DrawerBody>
    {selectedRequest && (
      <div className="drawerContent">
        <Text weight="semibold">Title</Text>
        <Text>{selectedRequest.title}</Text>

        <Text weight="semibold">Department</Text>
        <Text>{selectedRequest.department}</Text>

        <Text weight="semibold">Request Type</Text>
        <Text>{selectedRequest.requestType}</Text>

        <Text weight="semibold">Priority</Text>
        <PriorityBadge priority={selectedRequest.priority} />

        <Text weight="semibold">Status</Text>
        <StatusBadge status={selectedRequest.status} />

        <Text weight="semibold">Description</Text>
        <Text>{selectedRequest.description}</Text>

        <Text weight="semibold">Expected Benefit</Text>
        <Text>{selectedRequest.expectedBenefit}</Text>

        <Text weight="semibold">AI Summary</Text>
        <Text>{selectedRequest.aiSummary ?? 'Not analyzed yet.'}</Text>

        <Text weight="semibold">Recommended Next Step</Text>
        <Text>{selectedRequest.aiNextStep ?? '-'}</Text>

        <Button
          appearance="primary"
          onClick={() => analyzeRequest(selectedRequest)}
        >
          Analyze This Request
        </Button>

        <Button
  onClick={() => setIsDrawerOpen(false)}
>
  Close
</Button>
      </div>


    )}
  </DrawerBody>
</OverlayDrawer>

    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="dashboardCard">
      <div className="dashboardIcon">{icon}</div>
      <Text>{title}</Text>
      <Title1>{value}</Title1>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const color =
    priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success';

  return (
    <Badge appearance="filled" color={color}>
      {priority}
    </Badge>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const color =
    status === 'Completed'
      ? 'success'
      : status === 'Approved'
      ? 'brand'
      : status === 'In Review'
      ? 'warning'
      : 'subtle';

  return (
    <Badge appearance="filled" color={color}>
      {status}
    </Badge>
  );
}

export default App;