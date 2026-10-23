
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Heart,
  Users,
  MessageCircle,
  UserPlus,
  Send,
  LogOut,
  Search,
  RefreshCw,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

import Auth from './assets/Auth.jsx';
import {
  getToken,
  clearToken,
  getCurrentUser,
  getDiscoverUsers,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getConversation,
  sendMessage,
} from './api';

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  button, input { font: inherit; }
  button { cursor: pointer; }
  .vb { min-height: 100vh; color: #30234b; background: #f8f5ff; }
  .vb-header { position: sticky; top: 0; z-index: 10; background: rgba(255,255,255,.94); border-bottom: 1px solid #eee5ff; }
  .vb-header-inner { max-width: 1200px; margin: auto; padding: 15px 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
  .vb-brand { display: flex; align-items: center; gap: 10px; color: #7139d7; font-size: 23px; font-weight: 850; }
  .vb-logo { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 14px; color: white; background: linear-gradient(135deg,#a855f7,#6d28d9); }
  .vb-btn { border: 0; border-radius: 12px; padding: 10px 14px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; font-weight: 650; transition: .15s; }
  .vb-primary { background: #7c3aed; color: white; }
  .vb-primary:hover { background: #6d28d9; }
  .vb-secondary { background: #f0e8ff; color: #6d28d9; }
  .vb-plain { background: white; color: #665777; border: 1px solid #e9def9; }
  .vb-btn:disabled { opacity: .65; cursor: not-allowed; }
  .vb-main { max-width: 1200px; padding: 28px 22px 48px; margin: auto; }
  .vb-welcome { border-radius: 24px; padding: 28px; color: white; background: linear-gradient(120deg,#8b5cf6,#6d28d9 65%,#a855f7); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
  .vb-welcome h1 { margin: 0 0 8px; font-size: clamp(24px,4vw,34px); }
  .vb-welcome p { margin: 0; color: #f1e8ff; }
  .vb-columns { display: grid; grid-template-columns: minmax(260px, .9fr) minmax(0, 1.5fr); gap: 20px; margin-top: 22px; align-items: start; }
  .vb-card { background: white; border: 1px solid #eee6fb; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(80,40,130,.045); }
  .vb-card-head { padding: 18px; border-bottom: 1px solid #f1eafa; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .vb-card-head h2 { margin: 0; font-size: 17px; }
  .vb-card-body { padding: 16px; }
  .vb-search { display: flex; align-items: center; gap: 9px; border: 1px solid #e7ddf5; background: #fcfaff; padding: 10px 12px; border-radius: 12px; margin-bottom: 12px; color: #9a86b7; }
  .vb-search input { width: 100%; border: 0; outline: none; background: transparent; color: #30234b; min-width: 0; }
  .vb-person { display: flex; align-items: center; gap: 11px; padding: 12px 0; border-bottom: 1px solid #f3edf9; }
  .vb-person:last-child { border-bottom: 0; }
  .vb-avatar { flex: 0 0 42px; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 15px; background: #eee4ff; color: #7139d7; font-weight: 800; }
  .vb-person-info { min-width: 0; flex: 1; }
  .vb-person-info strong { display: block; overflow-wrap: anywhere; font-size: 14px; }
  .vb-muted { color: #8b7c9e; font-size: 12px; margin-top: 4px; overflow-wrap: anywhere; }
  .vb-small-btn { padding: 8px 10px; font-size: 12px; white-space: nowrap; }
  .vb-tabs { display: flex; gap: 7px; padding: 12px 16px 0; flex-wrap: wrap; }
  .vb-tab { border: 0; padding: 9px 12px; border-radius: 10px; color: #7b6a91; background: transparent; font-size: 13px; font-weight: 700; }
  .vb-tab.active { color: #6d28d9; background: #f1e8ff; }
  .vb-chat { min-height: 510px; display: flex; flex-direction: column; }
  .vb-chat-empty { min-height: 440px; display: grid; place-items: center; text-align: center; padding: 30px; color: #8b7c9e; }
  .vb-chat-empty-icon { width: 68px; height: 68px; border-radius: 23px; display: grid; place-items: center; margin: 0 auto 14px; background: #f0e7ff; color: #8b5cf6; }
  .vb-chat-title { display: flex; align-items: center; gap: 11px; min-width: 0; }
  .vb-chat-title h2 { font-size: 16px; margin: 0; }
  .vb-messages { padding: 18px; flex: 1; min-height: 300px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #fdfbff; }
  .vb-message { max-width: 82%; padding: 11px 13px; border-radius: 16px; overflow-wrap: anywhere; white-space: pre-wrap; font-size: 14px; line-height: 1.45; }
  .vb-message.mine { align-self: flex-end; color: white; background: #7c3aed; border-bottom-right-radius: 5px; }
  .vb-message.theirs { align-self: flex-start; color: #45365d; background: #eee7f7; border-bottom-left-radius: 5px; }
  .vb-time { display: block; margin-top: 5px; font-size: 10px; opacity: .72; }
  .vb-compose { display: flex; gap: 9px; padding: 14px; border-top: 1px solid #eee6fb; }
  .vb-compose input { flex: 1; min-width: 0; border: 1px solid #e7ddf5; border-radius: 13px; padding: 12px 14px; outline: none; }
  .vb-compose input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px #f1eaff; }
  .vb-alert { padding: 12px 14px; border-radius: 12px; background: #fff0f0; color: #b42318; margin: 15px 0; font-size: 13px; overflow-wrap: anywhere; }
  .vb-notice { padding: 12px 14px; border-radius: 12px; background: #f0eaff; color: #6d28d9; margin: 15px 0; font-size: 13px; overflow-wrap: anywhere; }
  .vb-empty { text-align: center; padding: 22px 10px; color: #9b8cad; font-size: 13px; }
  .vb-footer { text-align: center; color: #a091b3; font-size: 12px; padding: 25px; }
  @media(max-width: 760px) {
    .vb-columns { grid-template-columns: 1fr; }
    .vb-welcome { padding: 22px; align-items: flex-start; }
    .vb-header-inner { padding: 12px 15px; }
    .vb-main { padding: 18px 13px 32px; }
    .vb-card-head { padding: 14px; }
    .vb-chat { min-height: 430px; }
    .vb-messages { min-height: 260px; }
    .vb-welcome .vb-btn span { display: none; }
  }
`;

function getId(value) {
  return value?.id ??
    value?.userId ??
    value?.senderId ??
    value?.receiverId ??
    value?.user?.id ??
    null;
}

function getName(value) {
  return value?.fullName ??
    value?.name ??
    value?.senderName ??
    value?.receiverName ??
    value?.sender?.fullName ??
    value?.sender?.name ??
    value?.receiver?.fullName ??
    value?.receiver?.name ??
    value?.user?.fullName ??
    value?.user?.name ??
    'Vibely user';
}

function getEmail(value) {
  return value?.email ??
    value?.senderEmail ??
    value?.receiverEmail ??
    value?.sender?.email ??
    value?.receiver?.email ??
    value?.user?.email ??
    '';
}

function getOtherPerson(row, currentId) {
  const sender = row?.sender ?? {
    id: row?.senderId,
    name: row?.senderName,
    fullName: row?.senderName,
    email: row?.senderEmail,
  };

  const receiver = row?.receiver ?? {
    id: row?.receiverId,
    name: row?.receiverName,
    fullName: row?.receiverName,
    email: row?.receiverEmail,
  };

  return Number(getId(sender)) === Number(currentId)
    ? receiver
    : sender;
}

function displayTime(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.content)) return result.content;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

export default function App() {
  const [tokenVersion, setTokenVersion] = useState(0);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const bottomRef = useRef(null);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setUsers([]);
    setFriends([]);
    setIncoming([]);
    setOutgoing([]);
    setSelectedFriend(null);
    setMessages([]);
    setDraft('');
    setError('');
    setNotice('');
    setTokenVersion(version => version + 1);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!getToken()) return;

    setLoading(true);
    setError('');

    try {
      const [
        me,
        discovered,
        friendRows,
        incomingRows,
        outgoingRows,
      ] = await Promise.all([
        getCurrentUser(),
        getDiscoverUsers(),
        getFriends(),
        getIncomingRequests(),
        getOutgoingRequests(),
      ]);

      setUser(me);
      setUsers(toArray(discovered));
      setFriends(toArray(friendRows));
      setIncoming(toArray(incomingRows));
      setOutgoing(toArray(outgoingRows));
    } catch (err) {
      const message = err?.message || 'Could not load your Vibely account.';
      setError(message);

      if (/401|authentication|required|expired|invalid token/i.test(message)) {
        clearToken();
        setUser(null);
        setTokenVersion(version => version + 1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getToken()) {
      loadDashboard();
    }
  }, [loadDashboard, tokenVersion]);

  const acceptedPeople = friends
    .filter(row => String(row?.status ?? '').toUpperCase() === 'ACCEPTED')
    .map(row => getOtherPerson(row, user?.id))
    .filter(person => getId(person) != null)
    .filter((person, index, all) =>
      all.findIndex(item =>
        String(getId(item)) === String(getId(person))
      ) === index
    );

  const outgoingIds = new Set(
    outgoing.map(row => {
      const receiverId = row?.receiverId ?? row?.receiver?.id;
      return receiverId == null ? '' : String(receiverId);
    })
  );

  const incomingIds = new Set(
    incoming.map(row => {
      const senderId = row?.senderId ?? row?.sender?.id;
      return senderId == null ? '' : String(senderId);
    })
  );

  const acceptedIds = new Set(
    acceptedPeople.map(person => String(getId(person)))
  );

  const filteredUsers = users.filter(person => {
    const personId = getId(person);

    if (personId == null || String(personId) === String(user?.id)) {
      return false;
    }

    const query = search.trim().toLowerCase();

    return !query ||
      getName(person).toLowerCase().includes(query) ||
      getEmail(person).toLowerCase().includes(query);
  });

  const filteredFriends = acceptedPeople.filter(person => {
    const query = search.trim().toLowerCase();

    return !query ||
      getName(person).toLowerCase().includes(query) ||
      getEmail(person).toLowerCase().includes(query);
  });

  const loadConversation = useCallback(async friend => {
    if (!friend || getId(friend) == null) return;

    setSelectedFriend(friend);
    setMessages([]);
    setError('');

    try {
      const result = await getConversation(getId(friend));
      setMessages(toArray(result));
    } catch (err) {
      setError(err?.message || 'Could not load this conversation.');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  useEffect(() => {
    if (!selectedFriend || !getToken()) return undefined;

    let cancelled = false;

    const refresh = async () => {
      try {
        const result = await getConversation(getId(selectedFriend));

        if (!cancelled) {
          setMessages(toArray(result));
        }
      } catch {
        // Keep the current conversation visible if refresh fails.
      }
    };

    const timer = window.setInterval(refresh, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [selectedFriend]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !selectedFriend || sending) return;

    setSending(true);
    setError('');

    try {
      await sendMessage(getId(selectedFriend), content);
      setDraft('');

      const result = await getConversation(getId(selectedFriend));
      setMessages(toArray(result));
    } catch (err) {
      setError(err?.message || 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  }

  async function handleFriendRequest(person) {
    const personId = getId(person);

    if (personId == null || requestingId != null) return;

    setRequestingId(String(personId));
    setError('');
    setNotice('');

    try {
      await sendFriendRequest(personId);

      setNotice(`Friend request sent to ${getName(person)}.`);
      await loadDashboard();
    } catch (err) {
      const message = err?.message || 'Could not send friend request.';

      if (/409|conflict|already friends|already sent/i.test(message)) {
        setNotice(
          'A request already exists or you are already friends. Your community has been refreshed.'
        );
        await loadDashboard();
      } else {
        setError(message);
      }
    } finally {
      setRequestingId(null);
    }
  }

  async function handleAccept(row) {
    const requestId = row?.id ?? row?.requestId;

    if (requestId == null) {
      setError('Could not identify this friend request. Check the friend-request response format.');
      return;
    }

    try {
      setError('');
      setNotice('');

      await acceptFriendRequest(requestId);

      setNotice('Friend request accepted! You can now start chatting.');
      await loadDashboard();
      setActiveTab('friends');
    } catch (err) {
      setError(err?.message || 'Could not accept friend request.');
    }
  }

  async function handleReject(row) {
    const requestId = row?.id ?? row?.requestId;

    if (requestId == null) {
      setError('Could not identify this friend request.');
      return;
    }

    try {
      setError('');
      setNotice('');

      await rejectFriendRequest(requestId);

      setNotice('Friend request declined.');
      await loadDashboard();
    } catch (err) {
      setError(err?.message || 'Could not decline friend request.');
    }
  }

  function onAuthSuccess() {
    setError('');
    setNotice('');
    setTokenVersion(version => version + 1);
  }

  if (!getToken()) {
    return (
      <>
        <style>{styles}</style>
        <Auth onSuccess={onAuthSuccess} />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="vb">
        <header className="vb-header">
          <div className="vb-header-inner">
            <div className="vb-brand">
              <div className="vb-logo">
                <Heart size={22} fill="currentColor" />
              </div>
              <span>Vibely</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div className="vb-avatar">
                {(user?.email || 'V').charAt(0).toUpperCase()}
              </div>

              <button className="vb-btn vb-plain" onClick={logout}>
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="vb-main">
          <section className="vb-welcome">
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                <Sparkles size={17} />
                <span style={{
                  fontSize: 12,
                  fontWeight: 750,
                  letterSpacing: 1.2,
                }}>
                  YOUR SPACE, YOUR PEOPLE
                </span>
              </div>

              <h1>Hey, welcome to Vibely! 💜</h1>

              <p>
                Find your people, build friendships, and keep the conversation going.
              </p>

              <div style={{
                marginTop: 9,
                color: '#f1e8ff',
                fontSize: 13,
              }}>
                Signed in as {user?.email || 'your account'}
              </div>
            </div>

            <button
              className="vb-btn"
              style={{
                background: 'white',
                color: '#6d28d9',
                flexShrink: 0,
              }}
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw size={16} />
              <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          </section>

          {error && (
            <div className="vb-alert">
              <AlertCircle
                size={16}
                style={{ verticalAlign: 'middle', marginRight: 7 }}
              />
              {error}
            </div>
          )}

          {notice && (
            <div className="vb-notice">
              {notice}
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss notification"
                style={{
                  float: 'right',
                  border: 0,
                  background: 'none',
                  color: 'inherit',
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="vb-columns">
            <section className="vb-card">
              <div className="vb-card-head">
                <h2>
                  <Users
                    size={18}
                    style={{ verticalAlign: 'middle', marginRight: 7 }}
                  />
                  Your community
                </h2>

                <span className="vb-muted">
                  {acceptedPeople.length} friends
                </span>
              </div>

              <div className="vb-tabs">
                <button
                  className={`vb-tab ${activeTab === 'friends' ? 'active' : ''}`}
                  onClick={() => setActiveTab('friends')}
                >
                  Friends
                </button>

                <button
                  className={`vb-tab ${activeTab === 'discover' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discover')}
                >
                  Discover
                </button>

                <button
                  className={`vb-tab ${activeTab === 'requests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requests')}
                >
                  Requests{incoming.length > 0 ? ` (${incoming.length})` : ''}
                </button>
              </div>

              <div className="vb-card-body">
                <div className="vb-search">
                  <Search size={17} />

                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder={
                      activeTab === 'discover'
                        ? 'Find people by name or email'
                        : 'Search people'
                    }
                  />
                </div>

                {activeTab === 'friends' && (
                  filteredFriends.length === 0
                    ? (
                      <div className="vb-empty">
                        No friends found yet. Discover people and send a friend request.
                      </div>
                    )
                    : filteredFriends.map(person => (
                      <div className="vb-person" key={getId(person)}>
                        <div className="vb-avatar">
                          {getName(person).charAt(0).toUpperCase()}
                        </div>

                        <div className="vb-person-info">
                          <strong>{getName(person)}</strong>
                          <div className="vb-muted">{getEmail(person)}</div>
                        </div>

                        <button
                          className="vb-btn vb-primary vb-small-btn"
                          onClick={() => loadConversation(person)}
                        >
                          <MessageCircle size={14} /> Chat
                        </button>
                      </div>
                    ))
                )}

                {activeTab === 'discover' && (
                  filteredUsers.length === 0
                    ? (
                      <div className="vb-empty">
                        No matching users found. Try another name or email.
                      </div>
                    )
                    : filteredUsers.map(person => {
                      const id = String(getId(person));
                      const isFriend = acceptedIds.has(id);
                      const alreadySent = outgoingIds.has(id);
                      const hasIncomingRequest = incomingIds.has(id);
                      const isRequesting = requestingId === id;

                      return (
                        <div className="vb-person" key={id}>
                          <div className="vb-avatar">
                            {getName(person).charAt(0).toUpperCase()}
                          </div>

                          <div className="vb-person-info">
                            <strong>{getName(person)}</strong>
                            <div className="vb-muted">{getEmail(person)}</div>
                          </div>

                          {isFriend ? (
                            <button
                              className="vb-btn vb-secondary vb-small-btn"
                              onClick={() => {
                                const friend = acceptedPeople.find(
                                  item => String(getId(item)) === id
                                );

                                if (friend) loadConversation(friend);
                                setActiveTab('friends');
                              }}
                            >
                              <MessageCircle size={14} /> Chat
                            </button>
                          ) : hasIncomingRequest ? (
                            <button
                              className="vb-btn vb-primary vb-small-btn"
                              onClick={() => setActiveTab('requests')}
                            >
                              <Check size={14} /> Accept Request
                            </button>
                          ) : alreadySent ? (
                            <button
                              className="vb-btn vb-secondary vb-small-btn"
                              disabled
                            >
                              <Check size={14} /> Request Sent
                            </button>
                          ) : (
                            <button
                              className="vb-btn vb-secondary vb-small-btn"
                              disabled={isRequesting}
                              onClick={() => handleFriendRequest(person)}
                            >
                              <UserPlus size={14} />
                              {isRequesting ? 'Sending…' : 'Add Friend'}
                            </button>
                          )}
                        </div>
                      );
                    })
                )}

                {activeTab === 'requests' && (
                  incoming.length === 0
                    ? (
                      <div className="vb-empty">
                        No incoming friend requests right now.
                      </div>
                    )
                    : incoming.map((row, index) => {
                      const person = getOtherPerson(row, user?.id);
                      const requestId = row?.id ?? row?.requestId ?? index;

                      return (
                        <div className="vb-person" key={requestId}>
                          <div className="vb-avatar">
                            {getName(person).charAt(0).toUpperCase()}
                          </div>

                          <div className="vb-person-info">
                            <strong>{getName(person)}</strong>
                            <div className="vb-muted">
                              Wants to connect with you
                            </div>
                          </div>

                          <button
                            className="vb-btn vb-primary vb-small-btn"
                            title="Accept"
                            aria-label={`Accept request from ${getName(person)}`}
                            onClick={() => handleAccept(row)}
                          >
                            <Check size={15} />
                          </button>

                          <button
                            className="vb-btn vb-plain vb-small-btn"
                            title="Decline"
                            aria-label={`Decline request from ${getName(person)}`}
                            onClick={() => handleReject(row)}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      );
                    })
                )}
              </div>
            </section>

            <section className="vb-card vb-chat">
              {!selectedFriend ? (
                <div className="vb-chat-empty">
                  <div>
                    <div className="vb-chat-empty-icon">
                      <MessageCircle size={30} />
                    </div>

                    <h2 style={{
                      color: '#49365f',
                      marginBottom: 8,
                    }}>
                      Your conversations
                    </h2>

                    <p style={{
                      maxWidth: 320,
                      lineHeight: 1.6,
                      margin: '0 auto',
                    }}>
                      Choose a friend to open your chat. Your messages will be saved in your Vibely database.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="vb-card-head">
                    <div className="vb-chat-title">
                      <div className="vb-avatar">
                        {getName(selectedFriend).charAt(0).toUpperCase()}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <h2>{getName(selectedFriend)}</h2>
                        <div className="vb-muted">
                          Your Vibely conversation
                        </div>
                      </div>
                    </div>

                    <button
                      className="vb-btn vb-plain vb-small-btn"
                      onClick={() => {
                        setSelectedFriend(null);
                        setMessages([]);
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div className="vb-messages">
                    {messages.length === 0 ? (
                      <div className="vb-empty">
                        No messages yet. Say hello! 💜
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const senderId =
                          message.senderId ?? message.sender?.id;

                        const mine =
                          String(senderId) === String(user?.id);

                        return (
                          <div
                            className={`vb-message ${mine ? 'mine' : 'theirs'}`}
                            key={message.id ?? `${message.sentAt}-${index}`}
                          >
                            {message.content}

                            <span className="vb-time">
                              {displayTime(message.sentAt)}
                            </span>
                          </div>
                        );
                      })
                    )}

                    <div ref={bottomRef} />
                  </div>

                  <form className="vb-compose" onSubmit={handleSendMessage}>
                    <input
                      value={draft}
                      onChange={event => setDraft(event.target.value)}
                      maxLength={2000}
                      placeholder={`Message ${getName(selectedFriend)}…`}
                    />

                    <button
                      className="vb-btn vb-primary"
                      type="submit"
                      disabled={!draft.trim() || sending}
                    >
                      <Send size={17} />
                      <span>{sending ? 'Sending…' : 'Send'}</span>
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>

        <footer className="vb-footer">
          Made with 💜 on Vibely
        </footer>
      </div>
    </>
  );
}
